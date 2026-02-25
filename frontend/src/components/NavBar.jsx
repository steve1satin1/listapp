import { NavLink } from "react-router";
import { PenLine, Plus, Power } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { authapi } from "../lib/axios.js";

export const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  async function handleLogOut() {
    try {
      await authapi.get("/logout");
      navigate("/");
      setIsLoggedIn(false);
      toast.success("Logged out successfully.");
    } catch (error) {
      console.log("Error at logout handler at nav bar", error);
      toast.error("You are not logged in");
    }
  }

  return (
    <>
      <div className="navbar bg-primary flex justify-around">
        <NavLink to="/" className="btn btn-ghost text-xl md:text-3xl">
          <PenLine />
          Notes App
        </NavLink>
        {isLoggedIn ? (
          <div className="flex gap-5">
            <NavLink to="/create" className="btn btn-secondary text-xl">
              <Plus />
              <p className="hidden md:inline">Note</p>
            </NavLink>
            <button
              className="btn btn-error btn-square btn-sm text-sm font-bold"
              onClick={handleLogOut}
            >
              <Power size={20} />
            </button>
          </div>
        ) : (
          <button
            className="btn glass text-sm md:text-xl font-bold"
            onClick={() => {
              navigate("/login_register");
            }}
          >
            Log In/Register
          </button>
        )}
      </div>
    </>
  );
};
