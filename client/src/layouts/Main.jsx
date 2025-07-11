import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";

export default function Main() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
