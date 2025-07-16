import { useForm } from "react-hook-form";
import Badge from "../../components/profile/Badge";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function UserProfile() {
  const { user, updateUserProfile, loading, setLoading } = useAuth();
  const isPremium = user?.premium;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const { displayName, photoURL } = data;
    try {
      setLoading(true);
      await updateUserProfile(displayName, photoURL);
      toast.success("Profile updated!");
      reset(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-blue-100">
        <img
          src={user?.photoURL}
          alt={user?.displayName || "User"}
          className="w-28 h-28 rounded-full border-4 border-blue-400 object-cover shadow mb-4"
        />
        <Badge type={isPremium ? "Gold" : "Bronze"} />
        <h2 className="text-2xl font-bold text-blue-900 mt-2 mb-1">
          {user?.displayName || "No Name"}
        </h2>
        <p className="text-blue-600 text-sm mb-6">{user?.email}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mt-2 space-y-4"
        >
          <div>
            <label className="block text-blue-700 font-medium mb-1">Name</label>
            <input
              {...register("displayName", { required: "Name is required" })}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your name"
              defaultValue={user?.displayName}
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.displayName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">
              Profile Photo URL
            </label>
            <input
              {...register("photoURL")}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Paste image URL"
              defaultValue={user?.photoURL}
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="Enter your email"
              disabled
              defaultValue={user?.email}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-60"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
