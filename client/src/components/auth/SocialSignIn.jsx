import { FaGoogle } from "react-icons/fa";

export default function SocialSignIn() {
  const handleSocialSignIn = (socialProvider) => {
    console.log(socialProvider);
  };
  return (
    <div>
      <div>
        <button
          onClick={() => handleSocialSignIn("googleSignIn")}
          className="btn"
        >
          <FaGoogle size={16} /> <span>Google</span>
        </button>
      </div>
    </div>
  );
}
