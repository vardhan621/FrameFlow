import { FaFileAlt, FaTimes } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function SelectedFiles({
  selectedFiles,
  setSelectedFiles,
}) {
  const { theme } = useTheme();

  if (!selectedFiles || selectedFiles.length === 0) return null;

  const removeFile = (index) => {
    const files = Array.from(selectedFiles);
    files.splice(index, 1);

    const dt = new DataTransfer();

    files.forEach((file) => dt.items.add(file));

    setSelectedFiles(dt.files);
  };

  return (
    <div className="mt-6">
      <h3
        className={`font-semibold mb-3 ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        Selected Files ({selectedFiles.length})
      </h3>

      <div className="space-y-2">
        {Array.from(selectedFiles).map((file, index) => (
          <div
            key={index}
            className={`flex justify-between items-center rounded-xl px-4 py-3 border transition-all ${
              theme === "dark"
                ? "bg-slate-800 border-gray-700"
                : "bg-slate-100 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-blue-600" />

              <div>
                <p
                  className={`font-medium ${
                    theme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {file.name}
                </p>

                <p
                  className={`text-xs ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={() => removeFile(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}