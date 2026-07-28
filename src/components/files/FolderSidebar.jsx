import {
  FaImages,
  FaPhotoVideo,
  FaVideo,
  FaFilePdf,
  FaFileAlt,
  FaTrash,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function FolderSidebar({
  files,
  selectedCategory,
  setSelectedCategory,
}) {
  const { theme } = useTheme();

  const folders = [
    {
      name: "Raw Images",
      icon: <FaImages />,
    },
    {
      name: "Edited Images",
      icon: <FaPhotoVideo />,
    },
    {
      name: "Raw Videos",
      icon: <FaVideo />,
    },
    {
      name: "Edited Videos",
      icon: <FaVideo />,
    },
    {
      name: "Album PDF",
      icon: <FaFilePdf />,
    },
    {
      name: "Documents",
      icon: <FaFileAlt />,
    },
    {
      name: "Trash",
      icon: <FaTrash />,
    },
  ];

  return (
    <div
      className={`rounded-2xl shadow-lg p-5 border transition-all ${
        theme === "dark"
          ? "bg-[#111827] border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-5 ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        Categories
      </h2>

      <div className="space-y-2">
        {folders.map((folder) => {
          const count =
            folder.name === "Trash"
              ? files.filter((file) => file.isDeleted).length
              : files.filter(
                  (file) =>
                    file.category === folder.name &&
                    !file.isDeleted
                ).length;

          return (
            <button
              key={folder.name}
              onClick={() => setSelectedCategory(folder.name)}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                selectedCategory === folder.name
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "text-gray-300 hover:bg-slate-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {folder.icon}
                </span>

                <span className="font-medium">
                  {folder.name}
                </span>
              </div>

              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  selectedCategory === folder.name
                    ? "bg-white text-blue-600"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}