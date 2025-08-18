import { useEffect, useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../firebase/firebase.config";
import { AuthContext } from "../contexts";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create a user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // sign in a user
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // sign in with google
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // update a user's profile
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // reset user's password
  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // sign out the user
  const signOutUser = async () => {
    setUser(null);
    setLoading(true);
    await axios.post(
      `${import.meta.env.VITE_API_URL}/sign-out`,
      {},
      {
        withCredentials: true,
      }
    );
    return signOut(auth);
  };

  // get token from server
  const getToken = async (uid) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/jwt`,
      { uid },
      {
        withCredentials: true,
      }
    );
    return data;
  };

  // save user in database
  const saveUser = async (user) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
      uid: user?.uid,
      email: user?.email,
      name: user?.displayName,
      avatar: user?.photoURL || "https://i.ibb.co/9H2PJ7h2/d43801412989.jpg",
      role: "General",
      badge: "Bronze",
    });
    return data;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getToken(currentUser?.uid);
        saveUser(currentUser);
      }
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    createUser,
    signInUser,
    googleSignIn,
    updateUserProfile,
    resetPassword,
    signOutUser,
    loading,
    setLoading,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
