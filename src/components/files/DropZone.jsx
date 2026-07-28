import { FaCloudUploadAlt } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function DropZone({
  fileInputRef,
  setSelectedFiles,
  selectedFiles,
}) {
  const { theme } = useTheme();

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
        theme === "dark"
          ? "border-blue-500 bg-slate-800 hover:bg-slate-700"
          : "border-blue-400 bg-slate-50 hover:bg-blue-50"
      }`}
    >
      <FaCloudUploadAlt className="mx-auto text-6xl text-blue-500 mb-4" />

      <h2
        className={`text-xl font-bold ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        Drag & Drop Files Here
      </h2>

      <p
        className={`mt-2 ${
          theme === "dark"
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        or click below to browse
      </p>

      <button
        onClick={() => fileInputRef.current.click()}
        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all"
      >
        Browse Files
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => setSelectedFiles(e.target.files)}
      />

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="mt-6 text-left">
          <h3
            className={`font-semibold mb-2 ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Selected Files
          </h3>

          <ul className="space-y-1">
            {Array.from(selectedFiles).map((file, index) => (
              <li
                key={index}
                className={`text-sm ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                📄 {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}