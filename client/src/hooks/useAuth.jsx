import { useContext } from "react";
import { AuthContext } from "../contexts";

export default function useAuth() {
  const auth = useContext(AuthContext);
  return auth;
}
