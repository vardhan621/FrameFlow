import { useTheme } from "../../../context/ThemeContext";
import {
  Download,
  Trash2,
  Eye,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import {
  isImage,
  isVideo,
  isPdf,
  getDownloadUrl,
} from "../../../utils/fileHelpers";

export default function FileCard({
  file,
  index,
  category,
  files = [],
  onPreview,
  onDelete,
}) {
  const { theme } = useTheme();

  const fileUrl =
    file?.url ||
    file?.secure_url ||
    file?.fileUrl ||
    file?.path ||
    "";

  const image = isImage(fileUrl);
  const video = isVideo(fileUrl);
  const pdf = isPdf(file);

  const fileName =
    file?.originalName ||
    file?.name ||
    file?.filename ||
    file?.public_id?.split("/").pop() ||
    "Untitled";

  const uploadedDate = file?.uploadedAt
    ? new Date(file.uploadedAt).toLocaleDateString()
    : "";

  // Preview
  const handlePreview = () => {
    if (!fileUrl) return;

    onPreview?.(
      {
        ...file,
        url: fileUrl,
      },
      files,
      index
    );
  };

  return (
    <div
      className={`group overflow-hidden rounded-2xl border shadow-lg hover:shadow-2xl transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Preview Area */}

      <div
        className={`relative aspect-square overflow-hidden cursor-pointer ${
          theme === "dark"
            ? "bg-slate-800"
            : "bg-gray-100"
        }`}
        onClick={handlePreview}
      >
        {/* Image */}

        {image && (
          <img
            src={fileUrl}
            alt={fileName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        )}

        {/* Video */}

        {video && (
          <video
            src={fileUrl}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
          />
        )}

        {/* PDF */}

        {pdf && (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText
              size={70}
              className="text-red-500"
            />

            <p
              className={`mt-3 text-sm font-semibold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              PDF Document
            </p>
          </div>
        )}

        {/* Other Files */}

        {!image && !video && !pdf && (
          <div className="flex flex-col items-center justify-center h-full">
            <ImageIcon
              size={60}
              className={
                theme === "dark"
                  ? "text-gray-500"
                  : "text-gray-400"
              }
            />

            <p
              className={`mt-3 text-sm ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              No Preview
            </p>
          </div>
        )}

        {/* Hover Overlay */}

        {fileUrl && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreview();
              }}
              className="bg-white rounded-full p-3 shadow-xl hover:scale-110 transition"
            >
              <Eye
                size={20}
                className="text-gray-800"
              />
            </button>

          </div>
        )}
      </div>

      {/* Footer */}

      <div className="p-4">

        <h3
          title={fileName}
          className={`font-semibold truncate ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          {fileName}
        </h3>

        {uploadedDate && (
          <p
            className={`text-xs mt-1 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Uploaded: {uploadedDate}
          </p>
        )}

        <div className="flex justify-between mt-4">

          {/* Download */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              window.open(
                getDownloadUrl(fileUrl),
                "_blank"
              );
            }}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition"
          >
            <Download size={18} />
            Download
          </button>

          {/* Delete */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(category, index);
            }}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}