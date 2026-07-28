import { useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  ChevronDown,
  FolderOpen,
  Upload,
  Search,
  Image,
  Video,
  FileText,
} from "lucide-react";
import FileCard from "./FileCard";

export default function FolderSection({
  title,
  category,
  files = [],
  accept = "*",
  multiple = true,
  onUpload,
  onPreview,
  onDelete,
}) {
  const { theme } = useTheme();

  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;

    return files.filter((file) => {
      const name =
        file.originalName ||
        file.name ||
        file.filename ||
        file.public_id ||
        "";

      return name
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [files, search]);

  const getFolderIcon = () => {
    switch (category) {
      case "rawPhotos":
      case "editedPhotos":
        return <Image size={22} />;

      case "rawVideos":
      case "finalVideos":
        return <Video size={22} />;

      case "albumPdf":
        return <FileText size={22} />;

      default:
        return <FolderOpen size={22} />;
    }
  };

  const categoryLabel = {
    rawPhotos: "Raw Photos",
    editedPhotos: "Edited Photos",
    rawVideos: "Raw Videos",
    finalVideos: "Final Videos",
    albumPdf: "Album PDF",
  };

  return (
    <div
      className={`overflow-hidden rounded-3xl border shadow-xl transition-all duration-300 hover:border-blue-500 hover:shadow-2xl ${
        theme === "dark"
          ? "border-slate-700 bg-slate-900"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* ================= HEADER ================= */}

      <div
        className={`flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between ${
          theme === "dark"
            ? "border-b border-slate-700"
            : "border-b border-gray-200"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-4 text-left"
        >
          <div
            className={`transition-all duration-300 ease-in-out ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          >
            <ChevronDown
              size={22}
              className={
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }
            />
          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              theme === "dark"
                ? "bg-blue-600/20 text-blue-400"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {getFolderIcon()}
          </div>

          <div>
            <h2
              className={`text-xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span
                className={`text-sm ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {files.length} Files
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  theme === "dark"
                    ? "bg-slate-700 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {categoryLabel[category] || category}
              </span>
            </div>
          </div>
        </button>

        <label className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl active:scale-95">
          <Upload size={20} />

          Upload Files

          <input
            hidden
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => {
              const selectedFiles = Array.from(
                e.target.files || []
              );

              if (selectedFiles.length) {
                onUpload?.(
                  category,
                  selectedFiles
                );
              }

              e.target.value = "";
            }}
          />
        </label>
      </div>
            {/* ================= SEARCH ================= */}

      {open && (
        <>
          <div className="p-6">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search photos, videos or PDFs..."
                className={`w-full rounded-2xl border py-3 pl-12 pr-4 shadow-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:shadow-md ${
                  theme === "dark"
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-gray-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* ================= FILES ================= */}

          <div className="grid auto-rows-fr gap-6 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFiles.length === 0 ? (
              <div
                className={`col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 ${
                  theme === "dark"
                    ? "border-slate-700"
                    : "border-blue-300"
                }`}
              >
                <FolderOpen
                  size={70}
                  className="text-blue-500"
                />

                <h3
                  className={`mt-6 text-2xl font-bold ${
                    theme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  No Files Uploaded
                </h3>

                <p
                  className={`mt-3 max-w-md text-center ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  This folder is empty. Upload your photos,
                  videos or PDF files to start managing your
                  gallery.
                </p>

                <label className="mt-8 inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95">
                  <Upload size={20} />

                  Upload Files

                  <input
                    hidden
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => {
                      const selectedFiles = Array.from(
                        e.target.files || []
                      );

                      if (selectedFiles.length) {
                        onUpload?.(
                          category,
                          selectedFiles
                        );
                      }

                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            ) : (
              filteredFiles.map((file) => {
                const originalIndex = files.findIndex(
                  (f) => {
                    if (f._id && file._id) {
                      return f._id === file._id;
                    }

                    return f.url === file.url;
                  }
                );

                return (
                  <FileCard
                    key={
                      file._id ||
                      file.url ||
                      file.public_id
                    }
                    file={file}
                    files={filteredFiles}
                    index={originalIndex}
                    category={category}
                    onPreview={onPreview}
                    onDelete={onDelete}
                  />
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}