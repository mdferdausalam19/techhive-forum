import useRole from "../hooks/useRole";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { Navigate } from "react-router";

export default function PremiumRoute({ children }) {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (role === "Premium") {
    return children;
  }

  return <Navigate to="/membership" />;
}
