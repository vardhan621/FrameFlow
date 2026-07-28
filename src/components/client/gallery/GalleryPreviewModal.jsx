import { useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";

import {
  isImage,
  isVideo,
  isPdf,
  getDownloadUrl,
} from "../../../utils/fileHelpers";
export default function GalleryPreviewModal({
  open,
  files = [],
  currentIndex = 0,
  onClose,
  onNext,
  onPrevious,
}) {
  const { theme } = useTheme();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose?.();
          break;

        case "ArrowRight":
          if (files.length > 1) {
            onNext?.();
          }
          break;

        case "ArrowLeft":
          if (files.length > 1) {
            onPrevious?.();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    open,
    files.length,
    onClose,
    onNext,
    onPrevious,
  ]);

  if (!open) return null;

  const file = files[currentIndex];

  if (!file) return null;

  const rawUrl =
    file.url ||
    file.secure_url ||
    file.fileUrl ||
    file.path ||
    "";

  const fileUrl = rawUrl.startsWith("/uploads")
    ? `http://localhost:5000${rawUrl}`
    : rawUrl;

  const image = isImage(fileUrl);
  const video = isVideo(fileUrl);
  const pdf = isPdf(file);

  const fileName =
    file.originalName ||
    file.name ||
    file.filename ||
    file.public_id?.split("/").pop() ||
    "Untitled";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      {/* Header */}

      <div className="flex items-center justify-between p-5 text-white border-b border-slate-700">

        <div className="min-w-0">

          <h2 className="font-semibold text-lg truncate">
            {fileName}
          </h2>

          <p className="text-sm text-gray-400">
            {currentIndex + 1} / {files.length}
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                getDownloadUrl(fileUrl),
                "_blank"
              );
            }}
            className="p-2 rounded-xl hover:bg-slate-700 transition-all"
          >
            <Download size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="p-2 rounded-xl hover:bg-red-600 transition-all"
          >
            <X size={22} />
          </button>

        </div>

      </div>

      {/* Content */}

      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
                {/* Image */}

        {image && (
          <img
            src={fileUrl}
            alt={fileName}
            className="max-h-full max-w-full object-contain rounded-xl"
          />
        )}

        {/* Video */}

        {video && (
          <video
            src={fileUrl}
            controls
            autoPlay
            className="max-h-full max-w-full rounded-xl"
          />
        )}

        {/* PDF */}

        {pdf && (
          <div
            className={`w-[95%] h-[95%] rounded-2xl overflow-hidden flex flex-col border shadow-2xl ${
              theme === "dark"
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title={fileName}
              className="flex-1 border-0"
            />

            <div
              className={`p-4 flex justify-center border-t ${
                theme === "dark"
                  ? "border-slate-700"
                  : "border-gray-200"
              }`}
            >
              <button
                onClick={() =>
                  window.open(fileUrl, "_blank")
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all"
              >
                <ExternalLink size={18} />
                Open PDF in New Tab
              </button>
            </div>
          </div>
        )}

        {/* Unsupported File */}

        {!image && !video && !pdf && (
          <div className="text-center text-white">
            <FileText
              size={80}
              className="mx-auto mb-4 text-blue-400"
            />

            <p className="text-xl font-semibold">
              Preview not available
            </p>

            <p className="text-gray-400 mt-2">
              This file type cannot be previewed.
            </p>

            <button
              onClick={() =>
                window.open(fileUrl, "_blank")
              }
              className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all"
            >
              Open File
            </button>
          </div>
        )}

        {/* Navigation */}

        {files.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious?.();
              }}
              className="absolute left-5 p-3 rounded-full bg-slate-800/80 backdrop-blur-md text-white hover:bg-slate-700 transition-all shadow-lg"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              className="absolute right-5 p-3 rounded-full bg-slate-800/80 backdrop-blur-md text-white hover:bg-slate-700 transition-all shadow-lg"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
              </div>
    </div>
  );
}