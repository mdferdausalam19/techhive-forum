import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default function useAxiosSecure() {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  //   response interceptor
  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        await signOutUser();
        navigate("/sign-in");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
}
