import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";

export default function Main() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-5">
        <Outlet />
      </div>
    </div>
  );
}
