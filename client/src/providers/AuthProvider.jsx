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
  const createUser = async (email, password) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  };

  // sign in a user
  const signInUser = async (email, password) => {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  };

  // sign in with google
  const googleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await saveUser(currentUser);
          await getToken(currentUser.uid);
        } catch (error) {
          console.error("Error in auth state change:", error);
          await signOutUser();
          return;
        }
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
