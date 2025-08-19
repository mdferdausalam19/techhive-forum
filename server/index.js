const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

// Middleware setup for CORS and JSON parsing
const corsOptions = {
  origin: ["http://localhost:5173", "https://techhive-forum.vercel.app"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

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

// Middleware to verify JWT token and decode user information
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "unauthorized access!" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(403).json({ message: "forbidden access!" });
    }

    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    const database = client.db("techhive");
    const postsCollection = database.collection("posts");
    const usersCollection = database.collection("users");
    const commentsCollection = database.collection("comments");
    const reportsCollection = database.collection("reports");

    // Middleware to verify user role
    const verifyUserRole = (...allowedRoles) => {
      return async (req, res, next) => {
        try {
          const uid = req.user?.uid;
          if (!uid) {
            return res.status(401).json({ message: "unauthorized access!" });
          }

          const user = await usersCollection.findOne({ uid });
          if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "forbidden access!" });
          }

          next();
        } catch (err) {
          console.error("Error in verifyUserRole middleware:", err.message);
          res
            .status(500)
            .json({ message: "server error while verifying role." });
        }
      };
    };

    // API route to generate JWT token and set it as a cookie
    app.post("/jwt", async (req, res) => {
      try {
        const user = req.body;
        const query = { uid: user.uid };
        const existingUser = await usersCollection.findOne(query);
        if (!existingUser) {
          return res.status(401).json({
            message: "Invalid user.",
          });
        }
        const token = jwt.sign(
          { uid: existingUser.uid },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
          message: "Sign in successful!",
        });
      } catch (err) {
        console.error("Error logging in: ", err.message);
        res.status(500).json({
          message: "Failed to sign in.",
        });
      }
    });

    // API route to sign out and clear JWT token cookie
    app.post("/sign-out", async (req, res) => {
      try {
        res.clearCookie("token", {
          ...cookieOptions,
          maxAge: 0,
        });
        res.status(200).json({
          message: "Sign out successful!",
        });
      } catch (err) {
        console.error("Error signing out: ", err.message);
        res.status(500).json({
          message: "Failed to sign out.",
        });
      }
    });

    //  API route to get all users
    app.get(
      "/users",
      verifyToken,
      verifyUserRole("Admin"),
      async (req, res) => {
        try {
          const users = await usersCollection.find().toArray();
          res.status(200).json(users);
        } catch (err) {
          console.error("Error fetching users: ", err.message);
          res.status(500).json({
            message: "Failed to fetch users.",
          });
        }
      }
    );

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

    // API route to update user by email and reflect changes in their posts, comments and replies
    app.put(
      "/users/:uid",
      verifyToken,
      verifyUserRole("General", "Premium", "Admin"),
      async (req, res) => {
        try {
          const { uid } = req.params;
          const updateData = req.body;

          // Find the existing user
          const existingUser = await usersCollection.findOne({ uid });
          if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
          }

          // Update user in users collection
          const userUpdateResult = await usersCollection.updateOne(
            { uid },
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

          const updatedCommentsAuthor = {
            id: existingUser.uid,
            name: updateData.name ?? existingUser.name,
            avatar: updateData.avatar ?? existingUser.avatar,
          };

          // Update all comments created by this user using Firebase UID
          const commentsUpdateResult = await commentsCollection.updateMany(
            { "author.id": existingUser.uid },
            { $set: { author: updatedCommentsAuthor } }
          );

          // Update all comments replies created by this user using Firebase UID
          const repliesUpdateResult = await commentsCollection.updateMany(
            { "reply_to_author.id": existingUser.uid },
            { $set: { reply_to_author: updatedCommentsAuthor } }
          );

          res.status(200).json({
            message: "User and posts updated successfully!",
            userUpdated: userUpdateResult.modifiedCount,
            commentsUpdated: commentsUpdateResult.modifiedCount,
            repliesUpdated: repliesUpdateResult.modifiedCount,
            postsUpdated: postsUpdateResult.modifiedCount,
          });
        } catch (error) {
          console.error("Error updating user:", error);
          res.status(500).json({
            message: "Failed to update user and posts.",
            error: error.message,
          });
        }
      }
    );

    // API route to add a new post
    app.post(
      "/posts",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
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
      }
    );

    // API route to get all posts and optionally search by title and filter by category
    app.get("/posts", async (req, res) => {
      try {
        const { search, category } = req.query;
        const query = {};
        if (search) {
          query.title = { $regex: search, $options: "i" };
        }
        if (category) {
          query.category = category;
        }
        const posts = await postsCollection.find(query).toArray();
        res.status(200).json(posts);
      } catch (err) {
        console.error("Error fetching posts: ", err.message);
        res.status(500).json({
          message: "Failed to fetch posts.",
        });
      }
    });

    // API route to get a single post by ID
    app.get(
      "/posts/:id",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
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
      }
    );

    // API route to fetch all posts for a specific user
    app.get(
      "/posts/user/:uid",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const { uid } = req.params;
          const posts = await postsCollection
            .find({ "author.id": uid })
            .toArray();
          res.status(200).json(posts);
        } catch (err) {
          console.error("Error fetching posts: ", err.message);
          res.status(500).json({
            message: "Failed to fetch posts.",
          });
        }
      }
    );

    // API route to update a post
    app.put(
      "/posts/:id",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const { id } = req.params;
          const post = req.body;
          const result = await postsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...post, _id: new ObjectId(post._id) } }
          );
          res.status(200).json({
            message: "Post updated successfully!",
            post: result.modifiedCount,
          });
        } catch (err) {
          console.error("Error updating post: ", err.message);
          res.status(500).json({
            message: "Failed to update post.",
          });
        }
      }
    );

    // API route to delete a post
    app.delete(
      "/posts/:id",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const { id } = req.params;
          const result = await postsCollection.deleteOne({
            _id: new ObjectId(id),
          });
          res.status(200).json({
            message: "Post deleted successfully!",
            post: result.deletedCount,
          });
        } catch (err) {
          console.error("Error deleting post: ", err.message);
          res.status(500).json({
            message: "Failed to delete post.",
          });
        }
      }
    );

    // API route to vote a post
    app.patch(
      "/posts/:id/vote",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const { id } = req.params;
          const voteInfo = req.body;
          if (voteInfo.type === "upvote") {
            const isdownvoted = await postsCollection.findOne({
              _id: new ObjectId(id),
              downvotes: voteInfo.user_id,
            });

            if (isdownvoted) {
              await postsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $pull: { downvotes: voteInfo.user_id } }
              );
            }

            const result = await postsCollection.updateOne(
              { _id: new ObjectId(id) },
              { $push: { upvotes: voteInfo.user_id } }
            );
            res.status(200).json({
              message: "Post upvoted successfully!",
              post: result.modifiedCount,
            });
          } else {
            const isupvoted = await postsCollection.findOne({
              _id: new ObjectId(id),
              upvotes: voteInfo.user_id,
            });
            if (isupvoted) {
              await postsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $pull: { upvotes: voteInfo.user_id } }
              );
            }
            const result = await postsCollection.updateOne(
              { _id: new ObjectId(id) },
              { $push: { downvotes: voteInfo.user_id } }
            );
            res.status(200).json({
              message: "Post downvoted successfully!",
              post: result.modifiedCount,
            });
          }
        } catch (err) {
          console.error("Error voting post: ", err.message);
          res.status(500).json({
            message: "Failed to vote post.",
          });
        }
      }
    );

    // API route to like a post
    app.patch(
      "/posts/:id/like",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const { id } = req.params;
          const likeInfo = req.body;
          const isLiked = await postsCollection.findOne({
            _id: new ObjectId(id),
            likes: likeInfo.user_id,
          });
          if (isLiked) {
            const result = await postsCollection.updateOne(
              { _id: new ObjectId(id) },
              { $pull: { likes: likeInfo.user_id } }
            );
            return res.status(200).json({
              message: "Post unliked successfully!",
              post: result.modifiedCount,
            });
          }
          const result = await postsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $push: { likes: likeInfo.user_id } }
          );
          res.status(200).json({
            message: "Post liked successfully!",
            post: result.modifiedCount,
          });
        } catch (err) {
          console.error("Error liking post: ", err.message);
          res.status(500).json({
            message: "Failed to like post.",
          });
        }
      }
    );

    // API route to get comments for a post
    app.get(
      "/posts/:id/comments",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const { id } = req.params;
          const comments = await commentsCollection
            .find({ post_id: id })
            .toArray();
          res.status(200).json(comments);
        } catch (err) {
          console.error("Error fetching comments: ", err.message);
          res.status(500).json({
            message: "Failed to fetch comments.",
          });
        }
      }
    );

    // API route to comment on a post
    app.post(
      "/posts/:id/comment",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const commentInfo = req.body;
          const result = await commentsCollection.insertOne(commentInfo);
          const post = await postsCollection.findOne({
            _id: new ObjectId(commentInfo.post_id),
          });
          if (post) {
            const result = await postsCollection.updateOne(
              { _id: new ObjectId(commentInfo.post_id) },
              { $push: { comments: commentInfo.author.id } }
            );
          }
          res.status(200).json({
            message: "Comment added successfully!",
            comment: result.insertedId,
          });
        } catch (err) {
          console.error("Error commenting on post: ", err.message);
          res.status(500).json({
            message: "Failed to comment on post.",
          });
        }
      }
    );

    // API route to report a comment
    app.post(
      "/comments/:id/report",
      verifyToken,
      verifyUserRole("General", "Premium"),
      async (req, res) => {
        try {
          const { id } = req.params;
          const reportInfo = req.body;
          const result = await reportsCollection.insertOne(reportInfo);
          const comment = await commentsCollection.findOne({
            _id: new ObjectId(id),
          });
          if (comment) {
            const result = await commentsCollection.updateOne(
              { _id: new ObjectId(id) },
              { $push: { reports: reportInfo.user_id } }
            );
          }
          res.status(200).json({
            message: "Comment reported successfully!",
            comment: result.insertedId,
          });
        } catch (err) {
          console.error("Error reporting comment: ", err.message);
          res.status(500).json({
            message: "Failed to report comment.",
          });
        }
      }
    );

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
