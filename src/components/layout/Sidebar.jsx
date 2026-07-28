import { useEffect, useState } from "react";
import {
  FiHome,
  FiUsers,
  FiCamera,
  FiDollarSign,
  FiSettings,
  FiCalendar,
  FiUser,
  FiImage,
  FiCreditCard,
  FiBarChart2,
  FiClock,
  FiClipboard,
  FiFolder,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { NavLink } from "react-router-dom";
import API from "../../services/api";

function Sidebar() {
  const [studio, setStudio] = useState(null);
  const { theme } = useTheme();
  useEffect(() => {
    fetchStudio();
  }, []);

  const fetchStudio = async () => {
    try {
      const res = await API.get("/settings");
      setStudio(res.data.studio);
    } catch (err) {
      console.log(err);
    }
  };

  return (
   <aside
      className={`w-64 min-h-screen border-r transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-gray-200"
      }`}
    >

      {/* Logo */}

      <div
        className={`p-6 border-b flex flex-col items-center ${
          theme === "dark"
            ? "border-slate-800"
            : "border-gray-200"
        }`}
      >

        {studio?.logo ? (

          <img
            src={studio.logo}
            alt="Studio Logo"
            className="w-24 h-24 rounded-full bg-white object-contain p-2 shadow-lg"
          />

        ) : (

          <div className={`w-24 h-24 rounded-full flex justify-center items-center text-5xl ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-gray-200"
          }`}>
            📸
          </div>

        )}

        <h1 className={`text-xl font-bold mt-4 text-center ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}>
          {studio?.studioName || "FrameFlow Studio"}
        </h1>

        <p className={`text-sm ${
          theme === "dark"
            ? "text-gray-400"
            : "text-gray-600"
        }`}>
          {studio?.ownerName || "Studio Owner"}
        </p>

      </div>

      {/* Menu */}

      <nav className="p-4 space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-slate-800"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
        >
          <FiHome />
          Dashboard
        </NavLink>

        <NavLink
          to="/clients"
          className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-slate-800"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
        >
          <FiUsers />
          Clients
        </NavLink>

        <NavLink
          to="/calendar"
         className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-slate-800"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
        >
          <FiCalendar />
          Calendar
        </NavLink>

        <NavLink
          to="/shoots"
          className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-slate-800"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
        >
          <FiCamera />
          Shoots
        </NavLink>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiDollarSign />
          Payments
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiCreditCard />
          Expenses
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-slate-800"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
        >
          <FiImage />
          Gallery
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiUser />
          Employees
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiClock />
          Attendance
        </NavLink>
        <NavLink
          to="/leave"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiClipboard />
          Leave
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiBarChart2 />
          Reports
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-slate-800"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
        >
          <FiSettings />
          Settings
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiClipboard />
          Tasks
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FiFolder />
          Projects
        </NavLink>
      </nav>

    </aside>
  );
}

export default Sidebar;