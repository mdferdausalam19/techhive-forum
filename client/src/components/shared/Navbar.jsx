import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, signOutUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/sign-in");
      toast.success("Sign out successful.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <nav className=" bg-base-100 shadow-sm">
      <div className="navbar container mx-auto px-5">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/"}>Home</Link>
              </li>
            </ul>
          </div>
          <Link to={"/"} className="btn btn-ghost text-xl font-bold">
            TechHive
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-3">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {loading ? (
            <span className="loading loading-ring loading-xl"></span>
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    referrerPolicy="no-referrer"
                    alt="profile photo"
                    src={user && user.photoURL ? user.photoURL : ""}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <button className="justify-between">Profile</button>
                </li>
                <li>
                  <button onClick={handleSignOut}>SignOut</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to={"/sign-in"} className="btn">
                SignIn
              </Link>
              <Link to={"/sign-up"} className="btn">
                SignUp
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
