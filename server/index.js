const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB dependencies and client initialization
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DATABASE_URI;

// Create a new MongoDB client with configuration
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("techhive");
    const postsCollection = database.collection("posts");
    const usersCollection = database.collection("users");

    // API route to save user data
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user.email };

        // if existing user try to sign in again
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
          return res.status(200).json({
            message: "Registered user found!",
          });
        }
        const result = await usersCollection.insertOne({
          ...user,
          timestamp: Date.now(),
        });
        res.status(201).json({
          message: "User added successfully!",
          user: result.insertedId,
        });
      } catch (err) {
        console.error("Error adding user: ", err.message);
        res.status(500).json({
          message: "Failed to add user.",
        });
      }
    });

    // API route to update user by email and reflect changes in their posts
    app.put("/users/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const updateData = req.body;

        // Find the existing user
        const existingUser = await usersCollection.findOne({ email });
        if (!existingUser) {
          return res.status(404).json({ message: "User not found." });
        }

        // Update user in users collection
        const userUpdateResult = await usersCollection.updateOne(
          { email },
          { $set: updateData }
        );

        // Create updated author object with new data
        const updatedAuthor = {
          id: existingUser.uid,
          name: updateData.name ?? existingUser.name,
          avatar: updateData.avatar ?? existingUser.avatar,
          badge: updateData.badge ?? existingUser.badge,
          role: updateData.role ?? existingUser.role,
        };

        // Update all posts created by this user using Firebase UID
        const postsUpdateResult = await postsCollection.updateMany(
          { "author.id": existingUser.uid },
          { $set: { author: updatedAuthor } }
        );

        res.status(200).json({
          message: "User and posts updated successfully!",
          userUpdated: userUpdateResult.modifiedCount,
          postsUpdated: postsUpdateResult.modifiedCount,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
          message: "Failed to update user and posts.",
          error: error.message,
        });
      }
    });

    // API route to add a new post
    app.post("/posts", async (req, res) => {
      try {
        const post = req.body;
        const result = await postsCollection.insertOne(post);
        res.status(201).json({
          message: "Post added successfully!",
          post: result.insertedId,
        });
      } catch (err) {
        console.error("Error adding post: ", err.message);
        res.status(500).json({
          message: "Failed to add post.",
        });
      }
    });

    // API route to get all posts
    app.get("/posts", async (req, res) => {
      try {
        const posts = await postsCollection.find().toArray();
        res.status(200).json(posts);
      } catch (err) {
        console.error("Error fetching posts: ", err.message);
        res.status(500).json({
          message: "Failed to fetch posts.",
        });
      }
    });

    // API route to get a single post by ID
    app.get("/posts/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!post) {
          return res.status(404).json({
            message: "Post not found.",
          });
        }
        res.status(200).json(post);
      } catch (err) {
        console.error("Error fetching post: ", err.message);
        res.status(500).json({
          message: "Failed to fetch post.",
        });
      }
    });

    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    // Log any errors during connection or runtime
    console.error("Error connecting to MongoDB: ", err.message);
  }
}

// Run the async function to initialize the database connection and routes
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the TechHive Backend API! 🚀");
});

app.listen(port, () => {
  console.log(`TechHive Backend is running on port ${port}`);
});
