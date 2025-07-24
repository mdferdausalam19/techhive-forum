import { createBrowserRouter } from "react-router";
import Main from "../layouts/Main";
import ErrorPage from "../pages/error/ErrorPage";
import Home from "../pages/home/Home";
import SignIn from "../pages/signIn/SignIn";
import SignUp from "../pages/signUp/SignUp";
import UserProfile from "../pages/userProfile/UserProfile";
import PostDetails from "../components/forum/PostDetails";
import AllPosts from "../pages/forum/AllPosts";
import PrivateRoute from "./PrivateRoute";
import Membership from "../pages/membership/Membership";
import AIAssistant from "../pages/ai/AIAssistant";
import CreatePost from "../pages/post/CreatePost";
import EditPost from "../pages/post/EditPost";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/posts",
        element: (
          <PrivateRoute>
            <AllPosts />
          </PrivateRoute>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <PrivateRoute>
            <PostDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/membership",
        element: <Membership />,
      },
      {
        path: "/ai-assistant",
        element: (
          <PrivateRoute>
            <AIAssistant />
          </PrivateRoute>
        ),
      },
      {
        path: "/create-post",
        element: (
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-post/:id",
        element: (
          <PrivateRoute>
            <EditPost />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);
