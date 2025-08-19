import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useRole() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = "", isLoading } = useQuery({
    queryKey: ["user-role", user?.uid],
    enabled: !loading && !!user?.uid,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${user?.uid}`);
      return data?.role;
    },
  });

  return { role, isLoading };
}
