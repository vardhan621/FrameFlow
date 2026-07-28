import {
  FaSearch,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function Toolbar({
  search,
  setSearch,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-2xl shadow-lg p-4 border transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
        theme === "dark"
          ? "bg-[#111827] border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Search Box */}
      <div className="relative flex-1">
        <FaSearch
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        />

        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-xl pl-12 pr-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            theme === "dark"
              ? "bg-slate-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`rounded-xl px-3 py-2 border transition-all ${
            theme === "dark"
              ? "bg-slate-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="nameAsc">Name (A-Z)</option>
          <option value="nameDesc">Name (Z-A)</option>
          <option value="sizeLarge">Largest Size</option>
          <option value="sizeSmall">Smallest Size</option>
        </select>

        {/* Grid View */}
        <button
          onClick={() => setViewMode("grid")}
          className={`p-3 rounded-xl transition-all ${
            viewMode === "grid"
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "bg-slate-800 hover:bg-slate-700 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <FaThLarge />
        </button>

        {/* List View */}
        <button
          onClick={() => setViewMode("list")}
          className={`p-3 rounded-xl transition-all ${
            viewMode === "list"
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "bg-slate-800 hover:bg-slate-700 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <FaList />
        </button>
      </div>
    </div>
  );
}