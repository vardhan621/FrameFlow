import { useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Upload,
  Search,
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

  return (
    <div
      className={`rounded-2xl border shadow-lg transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}

      <div className="flex items-center justify-between p-5">

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          {open ? (
            <ChevronDown
              size={20}
              className={
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }
            />
          ) : (
            <ChevronRight
              size={20}
              className={
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }
            />
          )}

          <FolderOpen
            className="text-yellow-500"
            size={24}
          />

          <div className="text-left">

            <h2
              className={`font-semibold text-lg ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {title}
            </h2>

            <p
              className={
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }
            >
              {files.length} Files
            </p>

          </div>

        </button>

        <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl shadow">

          <Upload size={18} />

          Upload

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

      {open && (
        <>
          {/* Search */}

          <div className="px-5 pb-5">

            <div className="relative">

              <Search
                size={18}
                className={
                  theme === "dark"
                    ? "absolute left-3 top-3 text-gray-400"
                    : "absolute left-3 top-3 text-gray-400"
                }
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search files..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />

            </div>

          </div>

          {/* Files */}

          <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredFiles.length === 0 ? (

              <div
                className={`col-span-full text-center py-12 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                No files available.
              </div>

            ) : (

              filteredFiles.map((file) => {
                const originalIndex =
                  files.findIndex((f) => {
                    if (
                      f._id &&
                      file._id
                    ) {
                      return (
                        f._id === file._id
                      );
                    }

                    return (
                      f.url === file.url
                    );
                  });

                return (
                  <FileCard
                    key={
                      file._id ||
                      file.url ||
                      file.public_id
                    }
                    file={file}
                    index={originalIndex}
                    files={filteredFiles}
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