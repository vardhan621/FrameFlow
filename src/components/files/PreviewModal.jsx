import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  FaTimes,
  FaDownload,
  FaTrash,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFilePdf,
  FaFileAlt,
} from "react-icons/fa";

export default function PreviewModal({
  isOpen,
  file,
  files,
  onClose,
  onDownload,
  onDeleteRequest,
  onNext,
  onPrevious,
  onSelect,
  currentIndex,
  totalFiles,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "ArrowLeft") {
        onPrevious();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrevious, onClose]);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const { theme } = useTheme();
  const dragStart = useRef({ x: 0, y: 0 });
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [file]);
  if (!isOpen || !file) return null;

  const fileUrl = `http://localhost:5000${file.fileUrl}`;

  const isImage = file.mimeType?.startsWith("image/");
  const isVideo = file.mimeType?.startsWith("video/");
  const isPdf = file.mimeType === "application/pdf";

  const isWord =
    file.mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimeType === "application/msword";

  const isExcel =
    file.mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimeType === "application/vnd.ms-excel";

  const isPowerPoint =
    file.mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.mimeType === "application/vnd.ms-powerpoint";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">

      <div
        className={`relative flex flex-col rounded-2xl shadow-2xl w-[95%] max-w-6xl h-[90vh] overflow-hidden ${
          theme === "dark"
            ? "bg-[#111827]"
            : "bg-white"
        }`}
      >

        {/* Header */}
        <div
          className={`flex justify-between items-center p-5 border-b ${
            theme === "dark"
              ? "border-gray-700"
              : "border-gray-200"
          }`}
        >

          <div>
            <h2
              className={`text-xl font-bold break-all ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {file.fileName}
            </h2>

            <p
              className={`text-sm ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {file.category}
            </p>

            <p className="text-blue-600 font-medium">
              {currentIndex + 1} / {totalFiles}
            </p>
          </div>
          <div className="flex items-center gap-2">

            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className={`px-3 py-1 rounded transition ${
                theme === "dark"
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              −
            </button>

            <span
              className={`w-14 text-center ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => setZoom((z) => Math.min(5, z + 0.25))}
              className={`px-3 py-1 rounded transition ${
                theme === "dark"
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              +
            </button>

            <button
              onClick={() => setZoom(1)}
            className={`px-3 py-1 rounded transition ${
              theme === "dark"
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
            >
              Reset
            </button>

            <button
              onClick={onClose}
             className={`text-2xl transition ${
              theme === "dark"
                ? "text-gray-300 hover:text-red-500"
                : "text-gray-600 hover:text-red-600"
            }`}
            >
              <FaTimes />
            </button>

          </div>

        </div>

        {/* Preview */}
        <div
          className={`relative flex-1 flex items-center justify-center overflow-auto ${
            theme === "dark"
              ? "bg-slate-900"
              : "bg-slate-100"
          }`}

          onWheel={(e) => {
            e.preventDefault();

            if (e.deltaY < 0) {
              setZoom((z) => Math.min(z + 0.2, 5));
            } else {
              setZoom((z) => Math.max(z - 0.2, 1));
            }
          }}
          >
          <button
            onClick={onPrevious}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white w-12 h-12 rounded-full text-2xl"
          >
            ←
          </button>
          {isImage ? (

            <img
              src={fileUrl}
              alt={file.fileName}
              draggable={false}
              onMouseDown={(e) => {
                if (zoom <= 1) return;

                setDragging(true);

                dragStart.current = {
                  x: e.clientX - position.x,
                  y: e.clientY - position.y,
                };
              }}
              onMouseMove={(e) => {
                if (!dragging) return;

                setPosition({
                  x: e.clientX - dragStart.current.x,
                  y: e.clientY - dragStart.current.y,
                });
              }}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: dragging ? "none" : "0.2s",
                cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
              }}
              className="max-w-full max-h-full object-contain select-none"
            />

          ) : isVideo ? (

            <video
              controls
              className="max-w-full max-h-full"
            >
              <source src={fileUrl} />
            </video>

          ) : isPdf ? (

            <iframe
              src={fileUrl}
              title={file.fileName}
              className="w-full h-full"
            />

          ) : isWord ? (

            <div className="text-center">
              <FaFileWord
                size={90}
                className="mx-auto text-blue-600"
              />

              <h2 className={`text-2xl font-bold mt-5 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}>
                Microsoft Word Document
              </h2>

              <p
                className={`mt-2 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Preview is not supported in browser.
              </p>
            </div>

          ) : isExcel ? (

            <div className="text-center">
              <FaFileExcel
                size={90}
                className="mx-auto text-green-600"
              />

              <h2
                className={`text-2xl font-bold mt-5 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Microsoft Excel File
              </h2>

              <p
                className={`mt-2 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Preview is not supported in browser.
              </p>
            </div>

          ) : isPowerPoint ? (

            <div className="text-center">
              <FaFilePowerpoint
                size={90}
                className="mx-auto text-orange-600"
              />

              <h2
                className={`text-2xl font-bold mt-5 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Microsoft PowerPoint
              </h2>

              <p
                className={`mt-2 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Preview is not supported in browser.
              </p>
            </div>

          ) : (

            <div className="text-center">

              <FaFileAlt
                size={90}
                className="mx-auto text-gray-500"
              />

              <h2
                className={`text-2xl font-bold mt-5 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Preview Not Available
              </h2>

              <p
              className={`mt-2 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
                This file type cannot be previewed in the browser.
              </p>

            </div>

          )}
          {totalFiles > 1 && (
            <button
              onClick={onNext}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white w-12 h-12 rounded-full text-2xl"
            >
              →
            </button>
          )}

        </div>
        <div
          className={`border-t p-3 ${
            theme === "dark"
              ? "border-gray-700 bg-slate-800"
              : "border-gray-200 bg-gray-100"
          }`}
        >

          <div className="flex gap-3 overflow-x-auto">

            {files?.map((item, index) => {

              const active = item._id === file._id;

              return (

                <button
                  key={item._id}
                  onClick={() => onSelect(item)}
                  className={`
                    flex-shrink-0
                    rounded-xl
                    overflow-hidden
                    border-4
                    transition
                    ${
                      active
                        ? "border-blue-600 scale-105"
                        : "border-transparent hover:border-blue-300"
                    }
                  `}
                >

                  {item.mimeType?.startsWith("image/") ? (

                    <img
                      src={`http://localhost:5000${item.fileUrl}`}
                      className="w-24 h-20 object-cover"
                      alt=""
                    />

                  ) : (

                    <div
                      className={`w-24 h-20 flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-slate-700 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >

                      <FaFileAlt size={30} />

                    </div>

                  )}

                </button>

              );

            })}

          </div>

        </div>
        {/* Footer */}
        <div
          className={`border-t p-5 flex justify-end gap-4 shrink-0 ${
            theme === "dark"
              ? "border-gray-700 bg-[#111827]"
              : "border-gray-200 bg-white"
          }`}
        >

          <button
            onClick={() => onDownload(file)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
          >
            <FaDownload className="inline mr-2" />
            Download
          </button>

          <button
            onClick={() => {
              onDeleteRequest(file);
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
          >
            <FaTrash className="inline mr-2" />
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}