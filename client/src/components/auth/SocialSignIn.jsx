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
      <div>
        <button
          disabled={loading}
          onClick={() => handleSocialSignIn(googleSignIn)}
          className="btn disabled:cursor-not-allowed"
        >
          {loading ? (
            <TbFidgetSpinner className="m-auto animate-spin text-xl text-blue-500" />
          ) : (
            <>
              <FaGoogle size={16} /> <span>{provider}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
