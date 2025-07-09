import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SocialSignIn from "../../components/auth/SocialSignIn";

export default function SignIn() {
  const [showPass, setShowPass] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignIn = (data) => {
    const { email, password } = data;
    console.log(email, password);
  };

  return (
    <div className="mb-10">
      <div className="text-center ">
        <h1 className="text-4xl lg:text-5xl font-bold mt-5 mb-3">Sign In</h1>
        <p>Welcome Back! Please sign in to continue.</p>
      </div>
      <div className="card max-w-sm border bg-base-100 shrink-0 shadow-2xl mx-auto mt-5">
        <form onSubmit={handleSubmit(handleSignIn)} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base">Email</span>
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
              <span className="label-text text-base">Password</span>
            </label>
            <div className="relative">
              <input
                {...register("password", { required: true })}
                type={showPass ? "password" : "text"}
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute top-4 right-4 cursor-pointer"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-block bg-base-300 ">Sign In</button>
          </div>
          <div className="mt-2">
            <p>
              Don’t have an account?{" "}
              <span className="italic text-blue-500 hover:underline">
                <Link to={"/sign-up"}>Sign Up</Link>
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
