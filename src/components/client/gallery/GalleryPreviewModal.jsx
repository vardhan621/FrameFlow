import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image as ImageIcon,
  Video,
  Maximize2,
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
  onSelect,
}) {
  const { theme } = useTheme();

  const modalRef = useRef(null);
  const imageRef = useRef(null);
  const thumbnailRef = useRef(null);

  const [zoom, setZoom] = useState(1);

  const [loading, setLoading] = useState(true);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] =
    useState(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });
  const [rotation, setRotation] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const touchStartDistance = useRef(null);
  const hideTimer = useRef(null);
  useEffect(() => {
    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });

    setLoading(true);
  }, [currentIndex]);

  useEffect(() => {
    if (!thumbnailRef.current) return;

    const active =
      thumbnailRef.current.querySelector(
        ".active-thumb"
      );

    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentIndex]);

  useEffect(() => {
    if (!open) return;

    const move = (e) => {
      if (!dragging || zoom <= 1) return;

      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };

    const up = () => {
      setDragging(false);
    };

    window.addEventListener(
      "mousemove",
      move
    );

    window.addEventListener(
      "mouseup",
      up
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        move
      );

      window.removeEventListener(
        "mouseup",
        up
      );
    };
  }, [dragging, zoom]);

  useEffect(() => {
    if (!open) return;

    const show = () => {
      setShowControls(true);

      clearTimeout(hideTimer.current);

      hideTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);

    show();

    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      clearTimeout(hideTimer.current);
    };

  }, [open]);

  useEffect(() => {

    if (!open) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose?.();
          break;

        case "ArrowRight":
          if (files.length > 1) onNext?.();
          break;

        case "ArrowLeft":
          if (files.length > 1) onPrevious?.();
          break;

        case "+":
        case "=":
          setZoom((z) =>
            Math.min(z + 0.2, 5)
          );
          break;

        case "-":
          setZoom((z) =>
            Math.max(z - 0.2, 1)
          );
          break;

        case "0":
          setRotation(0);

          setZoom(1);

          setPosition({
            x: 0,
            y: 0,
          });

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

  const uploadedDate = file?.uploadedAt
    ? new Date(file.uploadedAt).toLocaleDateString()
    : "Unknown";

  const fileType = image
    ? "Image"
    : video
    ? "Video"
    : pdf
    ? "PDF"
    : "File";

  const fileSize = file?.size
    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  return (
        <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* ================= HEADER ================= */}

      <div
        className={`
          transition-all
          duration-300
          ${showControls
          ? "opacity-100"
          : "opacity-0 pointer-events-none"}
          flex items-center justify-between border-b px-6 py-4 backdrop-blur-xl
          ${theme==="dark"
          ? " border-slate-700 bg-slate-900/70"
          : " border-gray-200 bg-white/80"}
        `}
      >
        <div className="min-w-0">
          <h2
            className={`truncate text-xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {fileName}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-3">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                image
                  ? "bg-emerald-500 text-white"
                  : video
                  ? "bg-violet-500 text-white"
                  : pdf
                  ? "bg-red-500 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
              {fileType}
            </span>

            <span
              className={`text-sm ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {currentIndex + 1} / {files.length}
            </span>

            <span
              className={`text-sm ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {uploadedDate}
            </span>

            {fileSize && (
              <span
                className={`text-sm ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {fileSize}
              </span>
            )}

          </div>
        </div>

        {/* Right Controls */}

        <div className="flex items-center gap-2">

          {/* Zoom % */}

          {image && (
            <div className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white">
              {Math.round(zoom * 100)}%
            </div>
          )}

          {/* Zoom Out */}

          {image && (
            <button
              onClick={(e) => {
                e.stopPropagation();

                setZoom((z) =>
                  Math.max(z - 0.2, 1)
                );
              }}
              className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
            >
              <ZoomOut size={20} />
            </button>
          )}

          {/* Zoom In */}

          {image && (
            <button
              onClick={(e) => {
                e.stopPropagation();

                setZoom((z) =>
                  Math.min(z + 0.2, 5)
                );
              }}
              className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
            >
              <ZoomIn size={20} />
            </button>
          )}

          {/* Reset */}

          {image && (
            <>
            <button
              onClick={(e) => {
                e.stopPropagation();

                setRotation(0);

                setZoom(1);

                setPosition({
                  x:0,
                  y:0
                });
              }}
              className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRotation((r) => r - 90);
              }}
              className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
            >
              ↺
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setRotation((r) => r + 90);
              }}
              className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
            >
              ↻
            </button>
            </>
          )}

          {/* Fullscreen */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              if (!document.fullscreenElement) {
                modalRef.current?.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
          >
            <Maximize2 size={20} />
          </button>

          {/* Download */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              window.open(
                getDownloadUrl(fileUrl),
                "_blank"
              );
            }}
            className="rounded-xl bg-blue-600 p-2 text-white transition hover:bg-blue-700"
          >
            <Download size={20} />
          </button>

          {/* Close */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="rounded-xl bg-red-600 p-2 text-white transition hover:bg-red-700"
          >
            <X size={22} />
          </button>

        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div
        className="relative flex-1 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex h-full items-center justify-center overflow-hidden p-8"
          onWheel={(e) => {
            if (!image) return;

            e.preventDefault();

            setZoom((prev) => {
              const value =
                prev + (e.deltaY < 0 ? 0.2 : -0.2);

              return Math.min(
                Math.max(value, 1),
                5
              );
            });
          }}
          onTouchStart={(e)=>{

            if(e.touches.length!==2)return;

            const dx=
            e.touches[0].clientX-
            e.touches[1].clientX;

            const dy=
            e.touches[0].clientY-
            e.touches[1].clientY;

            touchStartDistance.current=
            Math.sqrt(dx*dx+dy*dy);

            }}

            onTouchMove={(e)=>{

            if(
            e.touches.length!==2
            )return;

            const dx=
            e.touches[0].clientX-
            e.touches[1].clientX;

            const dy=
            e.touches[0].clientY-
            e.touches[1].clientY;

            const distance=
            Math.sqrt(dx*dx+dy*dy);

            const factor=
            distance/
            touchStartDistance.current;

            let newZoom=
            zoom*factor;

            newZoom=Math.max(
            1,
            Math.min(newZoom,5)
            );

            setZoom(newZoom);

            touchStartDistance.current=
            distance;

            }}
        >

          {/* Loading Skeleton */}

          {loading && image && (
            <div className="absolute h-[70vh] w-[70vw] animate-pulse rounded-3xl bg-slate-800" />
          )}

          {/* Image */}

          {image && (
            <img
              ref={imageRef}
              src={fileUrl}
              alt={fileName}
              onLoad={() => setLoading(false)}
              onDoubleClick={() => {
                if (zoom === 1) {
                  setZoom(2);
                } else {

                  setRotation(0);

                  setZoom(1);

                  setPosition({
                    x:0,
                    y:0
                  });

                }
              }}
              onMouseDown={(e) => {
                if (zoom <= 1) return;

                setDragging(true);

                dragStart.current = {
                  x: e.clientX - position.x,
                  y: e.clientY - position.y,
                };
              }}
              onWheel={(e)=>{
                e.preventDefault();

                let newZoom =
                zoom + (e.deltaY<0 ? 0.2 : -0.2);

                newZoom=Math.max(1,Math.min(newZoom,5));

                setZoom(newZoom);

                if(newZoom===1){
                  setPosition({
                  x:0,
                  y:0
                  });
                }
              }}
              style={{
               transform: `
                translate(${position.x}px,${position.y}px)
                scale(${zoom})
                rotate(${rotation}deg)
                `,
                transition: dragging
                  ? "none"
                  : "all .25s ease",
                cursor:
                  zoom > 1
                    ? dragging
                      ? "grabbing"
                      : "grab"
                    : "default",
              }}
              className={`max-h-full max-w-full rounded-3xl object-contain shadow-2xl transition-opacity duration-300 ${
                loading
                  ? "opacity-0"
                  : "opacity-100"
              }`}
            />
          )}
                    {/* ================= VIDEO ================= */}

          {video && (
            <div className="w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-700 bg-black shadow-2xl">
              <video
                src={fileUrl}
                controls
                autoPlay
                playsInline
                onLoadedData={() => setLoading(false)}
                className={`max-h-[85vh] w-full transition-opacity duration-300 ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          )}

          {/* ================= PDF ================= */}

          {pdf && (
            <div
              className={`flex h-[90%] w-[95%] flex-col overflow-hidden rounded-3xl border shadow-2xl ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-900"
                  : "border-gray-200 bg-white"
              }`}
            >
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                title={fileName}
                className="flex-1 border-0"
                onLoad={() => setLoading(false)}
              />

              <div
                className={`flex items-center justify-between border-t p-5 ${
                  theme === "dark"
                    ? "border-slate-700"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    size={22}
                    className="text-red-500"
                  />

                  <div>
                    <h3
                      className={`font-semibold ${
                        theme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      PDF Document
                    </h3>

                    <p
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Preview available
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    window.open(fileUrl, "_blank")
                  }
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                >
                  <ExternalLink size={18} />
                  Open PDF
                </button>
              </div>
            </div>
          )}

          {/* ================= UNSUPPORTED ================= */}

          {!image && !video && !pdf && (
            <div className="flex flex-col items-center text-center">

              <div className="rounded-full bg-slate-800 p-8 shadow-2xl">
                <ImageIcon
                  size={90}
                  className="text-blue-500"
                />
              </div>

              <h2 className="mt-8 text-3xl font-bold text-white">
                Preview Not Available
              </h2>

              <p className="mt-3 max-w-lg text-gray-400">
                This file type cannot be previewed inside
                the gallery. You can still open or download
                it.
              </p>

              <div className="mt-8 flex gap-4">

                <button
                  onClick={() =>
                    window.open(fileUrl, "_blank")
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Open File
                </button>

                <button
                  onClick={() =>
                    window.open(
                      getDownloadUrl(fileUrl),
                      "_blank"
                    )
                  }
                  className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
                >
                  Download
                </button>

              </div>

            </div>
          )}

        </div>

        {/* ================= PREVIOUS ================= */}

        {files.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (currentIndex === 0) {
                onSelect?.(files.length - 1);
              } else {
                onPrevious?.();
              }
            }}
            className={`
            absolute left-6 top-1/2
            -translate-y-1/2
            transition-all duration-300
            ${showControls
            ? "opacity-100"
            : "opacity-0 pointer-events-none"}
            rounded-full
            bg-slate-900/70
            p-4
            text-white
            shadow-2xl
            backdrop-blur-md
            hover:scale-110
            hover:bg-slate-800
            `}
          >
            <ChevronLeft size={30} />
          </button>
        )}

        {/* ================= NEXT ================= */}

        {files.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (
                currentIndex ===
                files.length - 1
              ) {
                onSelect?.(0);
              } else {
                onNext?.();
              }
            }}
            className={`
            absolute right-6 top-1/2
            -translate-y-1/2
            transition-all duration-300
            ${showControls
            ? "opacity-100"
            : "opacity-0 pointer-events-none"}
            rounded-full
            bg-slate-900/70
            p-4
            text-white
            shadow-2xl
            backdrop-blur-md
            hover:scale-110
            hover:bg-slate-800
            `}
          >
            <ChevronRight size={30} />
          </button>
        )}
                {/* ================= THUMBNAIL FILM STRIP ================= */}

        {files.length > 1 && (
          <div
            ref={thumbnailRef}
           className={`
            absolute
            bottom-5
            left-1/2
            flex
            max-w-[85%]
            -translate-x-1/2
            gap-3
            overflow-x-auto
            rounded-2xl
            bg-black/70
            p-3
            backdrop-blur-xl
            scrollbar-hide
            transition-all
            duration-300
            ${showControls
            ? "opacity-100"
            : "opacity-0 pointer-events-none"}
            `}
          >
            {files.map((item, i) => {
              const rawThumb =
                item.url ||
                item.secure_url ||
                item.fileUrl ||
                item.path ||
                "";

              const thumbUrl = rawThumb.startsWith("/uploads")
                ? `http://localhost:5000${rawThumb}`
                : rawThumb;

              const thumbImage = isImage(thumbUrl);
              const thumbVideo = isVideo(thumbUrl);
              const thumbPdf = isPdf(item);

              return (
                <div
                  key={i}
                  onClick={() => onSelect?.(i)}
                  className={`active-thumb relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all duration-300 ${
                    currentIndex === i
                      ? "scale-110 ring-4 ring-blue-500 shadow-2xl"
                      : "opacity-70 hover:scale-105 hover:opacity-100"
                  }`}
                >
                  {/* Image */}

                  {thumbImage && (
                    <img
                      src={thumbUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}

                  {/* Video */}

                  {thumbVideo && (
                    <>
                      <video
                        src={thumbUrl}
                        muted
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video
                          size={18}
                          className="text-white"
                        />
                      </div>
                    </>
                  )}

                  {/* PDF */}

                  {thumbPdf && (
                    <div className="flex h-full w-full items-center justify-center bg-red-100">
                      <FileText
                        size={28}
                        className="text-red-600"
                      />
                    </div>
                  )}

                  {/* Other */}

                  {!thumbImage &&
                    !thumbVideo &&
                    !thumbPdf && (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800">
                        <ImageIcon
                          size={24}
                          className="text-slate-400"
                        />
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}