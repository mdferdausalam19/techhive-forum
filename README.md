# 🤖 TechHive — AI-Driven Discussion Hub

A modern MERN-based forum platform enhanced with AI assistance, premium membership, and a complete admin panel for content moderation and analytics.

🔗 **Live Website:** https://techhive-forum.vercel.app/  
📦 **Repository:** https://github.com/mdferdausalam19/techhive-forum

---

## 📌 Overview

**TechHive** is a full-stack developer discussion platform that enables users to share posts, engage in discussions, and get AI-powered help. Administrators can manage the platform using an advanced dashboard, and users can subscribe to premium features for an enhanced experience.

This system supports:

- **General Users** → Create posts, comment, and vote.
- **Premium Users** → Access the AI assistant, view premium posts, and receive a special badge.
- **Admins** → Utilize a comprehensive dashboard for warnings, announcements, payment management, newsletters, and system statistics.

---

## ✨ Key Features

### 🧑‍💻 User Functionality

- **Authentication:** Secure user registration and login with Firebase and JWT.
- **Post Management:** Create, edit, and delete posts.
- **Interactive Discussions:** A real-time comment and reply system.
- **Voting System:** Upvote, downvote, and like posts.
- **Content Discovery:** Search and filter posts with ease.
- **Social Sharing:** Share posts via a custom modal.
- **Announcements:** Stay updated with a dedicated announcement section on the homepage.

### 🤖 AI Assistant (Premium)

- **Powered by Gemini 2.5 Flash:** Get instant tech help and post suggestions.
- **Clean Output:** AI responses are delivered in plain text without markdown.

### 💎 Premium Membership

- **Subscription:** A dummy payment system for membership upgrades.
- **Exclusive Access:** Unlock premium-only features and content.
- **Profile Badge:** A special badge to signify premium status.

### 🛡️ Admin Panel

- **Dashboard:** A full-featured dashboard with system statistics.
- **User Management:** Manage user roles and badges.
- **Content Moderation:** Monitor and delete posts, and manage reported comments with a warning system.
- **Platform Management:** Create and manage announcements, payments, and newsletter subscribers.

---

## 🏗️ Tech Stack

### 🌐 Frontend

- **Core:** React, Vite, Tailwind CSS
- **Navigation:** React Router
- **State Management:** TanStack React Query
- **Data Fetching:** Axios
- **Forms:** React Hook Form
- **Authentication:** Firebase
- **UI:** React Hot Toast, React Icons

### ⚙️ Backend

- **Core:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT, Cookie-parser
- **Environment:** dotenv, CORS
- **AI:** Google Generative AI (Gemini 2.5 Flash)

---

## 📂 Project Structure

Here is a high-level overview of the project structure:

```
techhive-forum/
├── client/         # Frontend React application
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── firebase/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── providers/
│   │   ├── routes/
│   │   └── ...
│   └── ...
├── server/         # Backend Express.js application
│   ├── index.js    # Main server file
│   └── ...
└── ...
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js
- npm or yarn
- MongoDB account
- Firebase project

### ⚙️ Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/mdferdausalam19/techhive-forum.git
    cd techhive-forum
    ```

2.  **Set up the frontend:**

    ```sh
    cd client
    npm install
    ```

3.  **Set up the backend:**
    ```sh
    cd ../server
    npm install
    ```

### 🔑 Environment Variables

Create a `.env` file in both the `client` and `server` directories and add the necessary environment variables.

- **Client (`client/.env`):**

  ```env
  VITE_APIKEY="your_firebase_api_key"
  VITE_AUTHDOMAIN="your_firebase_auth_domain"
  VITE_PROJECTID="your_firebase_project_id"
  VITE_STORAGEBUCKET="your_firebase_storage_bucket"
  VITE_MESSAGINGSENDERID="your_firebase_messaging_sender_id"
  VITE_APPID="your_firebase_app_id"
  VITE_API_URL="your_api_url"
  ```

- **Server (`server/.env`):**
  ```env
  DATABASE_URI="your_mongodb_connection_string"
  ACCESS_TOKEN_SECRET="your_jwt_secret"
  GEMINI_API_KEY="your_google_ai_api_key"
  ```

### ▶️ Running the Application

1.  **Start the backend:**

    ```sh
    cd server
    npm start
    ```

2.  **Start the frontend:**
    ```sh
    cd client
    npm run dev
    ```

---

## 📈 Future Enhancements

- Real-time notifications
- Rich text editor for posts
- Full AI chat history
- Advanced admin analytics
- Live updates using WebSockets

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
