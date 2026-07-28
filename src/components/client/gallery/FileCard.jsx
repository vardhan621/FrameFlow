import { useTheme } from "../../../context/ThemeContext";
import {
  Download,
  Trash2,
  Eye,
  FileText,
  Image as ImageIcon,
  Play,
  Calendar,
  HardDrive,
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
    : "Unknown";

  const fileSize = file?.size
    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  const fileType = image
    ? "Image"
    : video
    ? "Video"
    : pdf
    ? "PDF"
    : "File";

  const badgeColor = image
    ? "bg-emerald-500"
    : video
    ? "bg-violet-500"
    : pdf
    ? "bg-red-500"
    : "bg-slate-500";

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
      className={`group overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        theme === "dark"
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* ================= Preview ================= */}

      <div
        onClick={handlePreview}
        className={`relative aspect-square overflow-hidden cursor-pointer ${
          theme === "dark"
            ? "bg-slate-800"
            : "bg-gray-100"
        }`}
      >
        {/* File Type Badge */}

        <span
          className={`absolute left-4 top-4 z-20 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg ${badgeColor}`}
        >
          {fileType}
        </span>

        {/* Image */}

        {image && (
          <img
            src={fileUrl}
            alt={fileName}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        )}

        {/* Video */}

        {video && (
          <>
            <video
              src={fileUrl}
              muted
              preload="metadata"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/70 p-5 backdrop-blur">
                <Play
                  size={30}
                  className="fill-white text-white"
                />
              </div>
            </div>
          </>
        )}

        {/* PDF */}

        {pdf && (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="rounded-full bg-red-100 p-6">
              <FileText
                size={70}
                className="text-red-600"
              />
            </div>

            <h3
              className={`mt-5 font-semibold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              PDF Document
            </h3>
          </div>
        )}

        {/* Other Files */}

        {!image && !video && !pdf && (
          <div className="flex h-full flex-col items-center justify-center">
            <ImageIcon
              size={70}
              className={
                theme === "dark"
                  ? "text-slate-500"
                  : "text-gray-400"
              }
            />

            <p
              className={`mt-4 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Preview unavailable
            </p>
          </div>
        )}
                {/* ================= Hover Overlay ================= */}

        {fileUrl && (
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">

            {/* Preview */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreview();
              }}
              className="rounded-full bg-white p-3 text-gray-800 shadow-xl transition-all duration-300 hover:scale-110"
              title="Preview"
            >
              <Eye size={20} />
            </button>

            {/* Download */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(getDownloadUrl(fileUrl), "_blank");
              }}
              className="rounded-full bg-blue-600 p-3 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-blue-700"
              title="Download"
            >
              <Download size={20} />
            </button>

            {/* Delete */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(category, index);
              }}
              className="rounded-full bg-red-600 p-3 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-red-700"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* ================= Footer ================= */}

      <div className="space-y-4 p-5">
        <div>
          <h3
            title={fileName}
            className={`truncate text-base font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {fileName}
          </h3>

          <p
            className={`mt-1 text-xs ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {fileType}
          </p>
        </div>

        <div
          className={`space-y-2 rounded-2xl p-3 ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar
                size={15}
                className="text-blue-500"
              />

              <span
                className={`text-xs ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Uploaded
              </span>
            </div>

            <span
              className={`text-xs font-medium ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {uploadedDate}
            </span>
          </div>

          {fileSize && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive
                  size={15}
                  className="text-green-500"
                />

                <span
                  className={`text-xs ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Size
                </span>
              </div>

              <span
                className={`text-xs font-medium ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {fileSize}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(getDownloadUrl(fileUrl), "_blank");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700"
          >
            <Download size={17} />
            Download
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(category, index);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}