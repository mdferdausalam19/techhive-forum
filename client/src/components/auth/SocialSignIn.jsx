import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";

export default function SocialSignIn({ provider }) {
  const [loading, setLoading] = useState(false);
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSocialSignIn = async (socialProviderSignIn) => {
    try {
      setLoading(true);
      await socialProviderSignIn();
      navigate("/");
      toast.success("Sign in successful!");
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div>
      <button
        disabled={loading}
        onClick={() => handleSocialSignIn(googleSignIn)}
        className="group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 space-x-2"
      >
        {loading ? (
          <TbFidgetSpinner className="animate-spin text-xl text-blue-500" />
        ) : (
          <>
            <FaGoogle size={16} className="text-blue-500" />
            <span>Continue with {provider}</span>
          </>
        )}
      </button>
    </div>
  );
}
