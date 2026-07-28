import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useTheme } from "../../context/ThemeContext";

function Layout({ children }) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;