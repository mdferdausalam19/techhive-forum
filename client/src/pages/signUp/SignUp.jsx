import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TbFidgetSpinner } from "react-icons/tb";
import toast from "react-hot-toast";
import SocialSignIn from "../../components/auth/SocialSignIn";
import useAuth from "../../hooks/useAuth";

export default function SignUp() {
  const [showPass, setShowPass] = useState(true);
  const { createUser, updateUserProfile, googleSignIn, loading, setLoading } =
    useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSingUp = async (data) => {
    const { email, fullName, image, password } = data;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const lengthRegex = /^.{6,}$/;

    if (!lengthRegex.test(password)) {
      return toast.error("Password must be at least 6 characters long.");
    }
    if (!uppercaseRegex.test(password)) {
      return toast.error(
        "Password must include at least one uppercase letter."
      );
    }
    if (!lowercaseRegex.test(password)) {
      return toast.error(
        "Password must include at least one lowercase letter."
      );
    }

    try {
      setLoading(true);
      await createUser(email, password);
      await updateUserProfile(fullName, image);
      navigate("/");
      toast.success("Sign up successful!");
      reset();
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className="mb-10">
      <div className="text-center ">
        <h1 className="text-4xl lg:text-5xl font-bold mt-5 mb-3">Sign Up</h1>
        <p>Join us today to explore new features!</p>
      </div>
      <div className="card max-w-sm border bg-base-100 shrink-0 shadow-2xl mx-auto mt-5">
        <form onSubmit={handleSubmit(handleSingUp)} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium text-black">
                Name
              </span>
            </label>
            <input
              {...register("fullName", { required: true })}
              type="text"
              placeholder="Enter your full name"
              className="input input-bordered w-full"
            />
            {errors.fullName && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium text-black">
                Email
              </span>
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium text-black">
                Profile Photo
              </span>
            </label>
            <input
              {...register("image")}
              type="text"
              placeholder="Enter your photo URL"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium text-black">
                Password
              </span>
            </label>
            <div className="relative">
              <input
                {...register("password", { required: true })}
                type={showPass ? "password" : "text"}
                placeholder="Create a strong password"
                className="input input-bordered w-full"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute top-4 right-4 cursor-pointer z-2"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Password must include at least 6 characters, with one uppercase
              letter and one lowercase letter.
            </p>
          </div>
          <div className="form-control mt-6">
            <button
              disabled={loading}
              className="btn btn-block bg-base-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <TbFidgetSpinner className="m-auto animate-spin text-xl text-blue-500" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          <div className="mt-2">
            <p>
              Already have an account?{" "}
              <span className="italic text-blue-500 hover:underline">
                <Link to={"/sign-in"}>Sign In</Link>
              </span>
            </p>
          </div>
        </form>
        <div>
          <div className="divider">Continue With</div>
          <div className="text-center mb-8 mt-6">
            <SocialSignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
