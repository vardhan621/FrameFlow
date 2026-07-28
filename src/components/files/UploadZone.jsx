import DropZone from "./DropZone";
import SelectedFiles from "./SelectedFiles";
import { useTheme } from "../../context/ThemeContext";

export default function UploadZone({
  category,
  setCategory,
  fileInputRef,
  selectedFiles,
  setSelectedFiles,
  handleUpload,
  uploadProgress,
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-2xl shadow-lg p-6 border transition-all ${
        theme === "dark"
          ? "bg-[#111827] border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        Upload Files
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Category */}

        <div>
          <label
            className={`block mb-2 font-medium ${
              theme === "dark"
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            Select Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full rounded-xl p-3 border transition-all ${
              theme === "dark"
                ? "bg-slate-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option>Raw Images</option>
            <option>Edited Images</option>
            <option>Raw Videos</option>
            <option>Edited Videos</option>
            <option>Album PDF</option>
            <option>Documents</option>
          </select>
        </div>

        {/* DropZone */}

        <div>
          <label
            className={`block mb-2 font-medium ${
              theme === "dark"
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            Choose Files
          </label>

          <DropZone
            fileInputRef={fileInputRef}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />

          <SelectedFiles
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-6">
              <div
                className={`rounded-full h-3 ${
                  theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <p
                className={`text-sm mt-2 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all"
        >
          Upload Files
        </button>
      </div>
    </div>
  );
}