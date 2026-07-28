import {
  FaEye,
  FaDownload,
  FaTrash,
  FaEllipsisV,
  FaFilePdf,
  FaFileAlt,
  FaPlay,
  FaEdit,
} from "react-icons/fa";

export default function FileCard({
  file,
  selected,
  toggleSelection,
  onPreview,
  onDownload,
  onDelete,
  onRename,
  onRestore,
  onPermanentDelete,
  isTrash = false,
}){
  const isImage = file.category.includes("Images");
  const isVideo = file.category.includes("Videos");
  const isPdf = file.category === "Album PDF";

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden border transition-all duration-300
      ${
        selected
          ? "border-blue-500 ring-2 ring-blue-300 shadow-xl bg-blue-50"
          : "border-gray-200 bg-white shadow hover:shadow-2xl"
      }`}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-3 left-3 z-50 transition-all duration-200 ${
            selected
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
        >
        <label className="relative cursor-pointer">
            <input
            type="checkbox"
            checked={selected}
            onChange={() => toggleSelection(file._id)}
            className="peer sr-only"
            />

            <div
            className="
                w-7 h-7
                rounded-full
                bg-white
                border-2 border-gray-300
                shadow-md
                transition-all
                duration-200
                flex items-center justify-center
                hover:border-blue-500
                peer-checked:bg-blue-600
                peer-checked:border-blue-600
            "
            >
            <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
            >
                <path d="M5 13l4 4L19 7" />
            </svg>
            </div>
        </label>
        </div>

      {/* Thumbnail */}
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        {isImage ? (
          <img
            src={`http://localhost:5000${file.fileUrl}`}
            alt={file.fileName}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : isVideo ? (
          <div className="flex items-center justify-center h-full text-7xl text-purple-600">
            <FaPlay />
          </div>
        ) : isPdf ? (
          <div className="flex items-center justify-center h-full text-7xl text-red-600">
            <FaFilePdf />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-7xl text-blue-600">
            <FaFileAlt />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <button
            onClick={() => onPreview(file)}
            className="pointer-events-auto bg-white text-black px-5 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition"
          >
            <FaEye />
            Preview
          </button>
        </div>
      </div>

      {/* File Details */}
      <div className="p-4">
        <h3
          className="font-bold text-lg truncate"
          title={file.fileName}
        >
          {file.fileName}
        </h3>

        <p className="text-gray-500 mt-1">
          {file.category}
        </p>

        <div className="flex justify-between mt-3 text-sm text-gray-500">
          <span>
            {file.fileSize
              ? (file.fileSize / 1024 / 1024).toFixed(2)
              : "0.00"}{" "}
            MB
          </span>

          <span>
            {new Date(file.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t px-4 py-3 flex justify-between items-center">

        <button
          onClick={() => onDownload(file)}
          className="text-blue-600 hover:text-blue-800"
          title="Download"
        >
          <FaDownload />
        </button>

        <button
          onClick={() => onPreview(file)}
          className="text-gray-700 hover:text-black"
          title="Preview"
        >
          <FaEye />
        </button>

        {isTrash ? (
          <>
            <button
              onClick={() => onRestore(file)}
              className="text-green-600 hover:text-green-800"
              title="Restore"
            >
              ♻️
            </button>

            <button
              onClick={() => onPermanentDelete(file)}
              className="text-red-600 hover:text-red-800"
              title="Delete Permanently"
            >
              <FaTrash />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onRename(file)}
              className="text-green-600 hover:text-green-800"
              title="Rename"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => onDelete(file)}
              className="text-red-600 hover:text-red-800"
              title="Move to Trash"
            >
              <FaTrash />
            </button>
          </>
        )}

      </div>
    </div>
  );
}