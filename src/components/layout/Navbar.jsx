import {
  FiLogOut,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header
      className={`h-16 border-b flex items-center justify-between px-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-xl font-semibold ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        Dashboard
      </h2>

      <div className="flex items-center gap-5 relative z-[9999]">
        <SearchBar />

        <NotificationBell />

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition ${
            theme === "dark"
              ? "bg-slate-800 text-white hover:bg-slate-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {theme === "dark" ? (
            <FiSun size={20} />
          ) : (
            <FiMoon size={20} />
          )}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;