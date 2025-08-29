const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const paymentsCollection = database.collection("payments");
    const announcementsCollection = database.collection("announcements");

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

    // API route to get user by uid
    app.get("/users/:uid", verifyToken, async (req, res) => {
      try {
        const { uid } = req.params;
        const query = { uid };
        const user = await usersCollection.findOne(query);
        res.status(200).json(user);
      } catch (err) {
        console.error("Error fetching user: ", err.message);
        res.status(500).json({
          message: "Failed to fetch user.",
        });
      }
    });

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

    // API route to add payment
    app.post(
      "/payments",
      verifyToken,
      verifyUserRole("General"),
      async (req, res) => {
        try {
          const paymentInfo = req.body;
          paymentInfo.status = "completed";
          const result = await paymentsCollection.insertOne(paymentInfo);
          res.status(200).json({
            message: "Payment added successfully!",
            payment: result.insertedId,
          });
        } catch (err) {
          console.error("Error adding payment: ", err.message);
          res.status(500).json({
            message: "Failed to add payment.",
          });
        }
      }
    );

    // API route to get payments
    app.get(
      "/payments",
      verifyToken,
      verifyUserRole("Admin"),
      async (req, res) => {
        try {
          const payments = await paymentsCollection.find().toArray();
          res.status(200).json(payments);
        } catch (err) {
          console.error("Error fetching payments: ", err.message);
          res.status(500).json({
            message: "Failed to fetch payments.",
          });
        }
      }
    );

    // API route to upgrade user role and badge
    app.patch(
      "/upgrade",
      verifyToken,
      verifyUserRole("General"),
      async (req, res) => {
        try {
          const { uid } = req.body;

          const existingUser = await usersCollection.findOne({ uid });

          if (!existingUser) {
            return res.status(404).json({
              message: "User not found.",
            });
          }

          // Update the user's role and badge
          const updateData = {
            role: "Premium",
            badge: "Gold",
          };

          // Update user document
          const userResult = await usersCollection.updateOne(
            { uid },
            { $set: updateData }
          );

          // Update all posts where this user is the author
          const postsResult = await postsCollection.updateMany(
            { "author.id": uid },
            {
              $set: {
                "author.role": "Premium",
                "author.badge": "Gold",
              },
            }
          );

          res.status(200).json({
            message: "User role upgraded successfully!",
            user: userResult.modifiedCount,
            posts: postsResult.modifiedCount,
          });
        } catch (err) {
          console.error("Error upgrading user role: ", err.message);
          res.status(500).json({
            message: "Failed to upgrade user role.",
            error: err.message,
          });
        }
      }
    );

    // Admin Dashboard API Routes
    // API route to get dashboard statistics
    app.get(
      "/admin/stats",
      // verifyToken,
      // verifyUserRole("Admin"),
      async (req, res) => {
        try {
          const totalUsers = await usersCollection.countDocuments();
          const totalPosts = await postsCollection.countDocuments();
          const totalComments = await commentsCollection.countDocuments();

          // Calculate total revenue
          const payments = await paymentsCollection
            .find({ status: "completed" })
            .toArray();
          const totalRevenue = payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );

          res.json({
            totalUsers,
            totalPosts,
            totalComments,
            totalRevenue,
          });
        } catch (error) {
          console.error("Error fetching admin stats:", error);
          res.status(500).json({ error: "Failed to fetch admin statistics" });
        }
      }
    );

    // API route to get users
    app.get(
      "/admin/users",
      // verifyToken,
      // verifyUserRole("Admin"),
      async (req, res) => {
        const { limit, sort } = req.query;
        const limitValue = limit ? parseInt(limit) : 0;
        const sortValue = sort ? parseInt(sort) : 1;
        try {
          const users = await usersCollection
            .find({})
            .sort({ timestamp: sortValue })
            .limit(limitValue > 0 ? limitValue : 0)
            .toArray();

          res.json(users);
        } catch (error) {
          console.error("Error fetching recent users:", error);
          res.status(500).json({ error: "Failed to fetch recent users" });
        }
      }
    );

    // API route to get posts
    app.get(
      "/admin/posts",
      // verifyToken,
      // verifyUserRole("Admin"),
      async (req, res) => {
        const { limit, sort } = req.query;
        const limitValue = limit ? parseInt(limit) : 0;
        const sortValue = sort ? parseInt(sort) : 1;

        try {
          const posts = await postsCollection
            .find({})
            .sort({ date: sortValue })
            .limit(limitValue > 0 ? limitValue : 0)
            .toArray();

          res.json(posts);
        } catch (error) {
          console.error("Error fetching posts:", error);
          res.status(500).json({ error: "Failed to fetch posts" });
        }
      }
    );

    // API route to get payments
    app.get(
      "/admin/payments",
      // verifyToken,
      // verifyUserRole("Admin"),
      async (req, res) => {
        const { limit, sort } = req.query;
        const limitValue = limit ? parseInt(limit) : 0;
        const sortValue = sort ? parseInt(sort) : 1;
        try {
          const payments = await paymentsCollection
            .find({})
            .sort({ date: sortValue })
            .limit(limitValue > 0 ? limitValue : 0)
            .toArray();

          res.json(payments);
        } catch (error) {
          console.error("Error fetching recent payments:", error);
          res.status(500).json({ error: "Failed to fetch recent payments" });
        }
      }
    );

    // API route to add announcement
    app.post(
      "/admin/announcements",
      // verifyToken,
      // verifyUserRole("Admin"),
      async (req, res) => {
        try {
          const announcement = req.body;
          const result = await announcementsCollection.insertOne(announcement);
          res.status(200).json({
            message: "Announcement added successfully!",
            announcement: result.insertedId,
          });
        } catch (err) {
          console.error("Error adding announcement: ", err.message);
          res.status(500).json({
            message: "Failed to add announcement.",
          });
        }
      }
    );

    // API route to get announcements
    app.get("/announcements", async (req, res) => {
      try {
        const announcements = await announcementsCollection.find({}).toArray();

        res.json(announcements);
      } catch (error) {
        console.error("Error fetching recent announcements:", error);
        res.status(500).json({ error: "Failed to fetch recent announcements" });
      }
    });

    // API route for AI assistant
    app.post(
      "/ai/assist",
      verifyToken,
      verifyUserRole("Premium"),
      async (req, res) => {
        try {
          const { message } = req.body;

          if (!message) {
            return res.status(400).json({ error: "Message is required" });
          }

          // System prompt for clean, conversational responses
          const prompt = `You are a helpful AI assistant. Respond to the following message in a clear, friendly manner. Do not use any markdown formatting, code blocks, or special characters like **, \`, or #. Just provide a plain text response.`;

          // Generate content using the model
          const chat = model.startChat({
            history: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
              {
                role: "model",
                parts: [
                  { text: "I'm ready to help! What would you like to know?" },
                ],
              },
            ],
          });

          const result = await chat.sendMessage(message);
          const response = await result.response;
          let text = response.text();

          // Clean up the response
          text = text
            .replace(/[\*_`#]/g, "") // Remove markdown characters
            .replace(/\n\s*\n/g, "\n") // Remove extra newlines
            .trim();

          return res.json({
            type: "text",
            content: text,
          });
        } catch (error) {
          console.error("AI API Error:", error);
          return res.status(500).json({
            error: "Failed to process your request",
            details: error.message,
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
