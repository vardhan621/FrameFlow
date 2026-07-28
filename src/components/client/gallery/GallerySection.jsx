import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import FolderSection from "./FolderSection";
import GalleryPreviewModal from "./GalleryPreviewModal";
import { GALLERY_FOLDERS } from "../../../utils/folderStructure";

import {
  Images,
  Image,
  Video,
  FileText,
  Download,
} from "lucide-react";

export default function GallerySection({
  client,
  uploadFiles,
  deleteFile,
  downloadGallery,
  downloading,
}) {
  const { theme } = useTheme();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const gallery = {
    rawPhotos: client?.rawPhotos || [],
    editedPhotos: client?.editedPhotos || [],
    rawVideos: client?.rawVideos || [],
    finalVideos: client?.finalVideos || [],
    albumPdf: client?.albumPdf ? [client.albumPdf] : [],
  };

  // Gallery Statistics
  const totalRawPhotos = gallery.rawPhotos.length;
  const totalEditedPhotos = gallery.editedPhotos.length;
  const totalVideos =
    gallery.rawVideos.length + gallery.finalVideos.length;
  const totalAlbums = gallery.albumPdf.length;

  const openPreview = (file, files, index) => {
    setPreviewFiles(files);
    setCurrentIndex(index);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewFiles([]);
    setCurrentIndex(0);
  };

  const next = () => {
    setCurrentIndex((prev) =>
      prev === previewFiles.length - 1 ? 0 : prev + 1
    );
  };

  const previous = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? previewFiles.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="space-y-8">

        {/* ================= Gallery Header ================= */}

        <div
          className={`rounded-3xl border p-6 shadow-xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div className="flex items-center gap-4">

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                  theme === "dark"
                    ? "bg-blue-600/20 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <Images size={32} />
              </div>

              <div>
                <h2
                  className={`text-3xl font-bold ${
                    theme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Gallery
                </h2>

                <p
                  className={`mt-1 ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Upload, organize and manage all client photos,
                  videos and albums.
                </p>
              </div>

            </div>

            {/* Download Button */}

            <button
              onClick={downloadGallery}
              disabled={downloading}
              className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-semibold shadow-lg transition-all duration-300 ${
                downloading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-xl"
              } bg-blue-600 hover:bg-blue-700 text-white`}
            >
              <Download size={20} />

              {downloading
                ? "Downloading..."
                : "Download Gallery"}
            </button>

          </div>

          {/* ================= Statistics ================= */}

          <div className="grid gap-5 mt-8 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={<Image size={24} />}
              title="Raw Photos"
              value={totalRawPhotos}
              color="blue"
            />

            <StatCard
              icon={<Image size={24} />}
              title="Edited Photos"
              value={totalEditedPhotos}
              color="green"
            />

            <StatCard
              icon={<Video size={24} />}
              title="Videos"
              value={totalVideos}
              color="purple"
            />

            <StatCard
              icon={<FileText size={24} />}
              title="Albums"
              value={totalAlbums}
              color="orange"
            />

          </div>
        </div>

        {/* ================= Folder Container ================= */}

        <div
          className={`rounded-3xl border p-6 shadow-2xl transition-all duration-300 hover:border-blue-500 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
                    {GALLERY_FOLDERS.map((folder) => (
            <FolderSection
              key={folder.key}
              title={folder.name}
              category={folder.key}
              files={gallery[folder.key] || []}
              accept={folder.accept}
              multiple={folder.multiple}
              onUpload={uploadFiles}
              onDelete={deleteFile}
              onPreview={openPreview}
            />
          ))}
        </div>
      </div>

      {/* ================= Preview Modal ================= */}

      <GalleryPreviewModal
        open={previewOpen}
        files={previewFiles}
        currentIndex={currentIndex}
        onClose={closePreview}
        onNext={next}
        onPrevious={previous}
      />
    </>
  );
}

/* ================= Statistics Card ================= */

function StatCard({
  icon,
  title,
  value,
  color,
}) {
  const { theme } = useTheme();

  const styles = {
    blue:
      theme === "dark"
        ? "bg-slate-800 border-blue-700 text-blue-400"
        : "bg-blue-50 border-blue-200 text-blue-700",

    green:
      theme === "dark"
        ? "bg-slate-800 border-green-700 text-green-400"
        : "bg-green-50 border-green-200 text-green-700",

    purple:
      theme === "dark"
        ? "bg-slate-800 border-purple-700 text-purple-400"
        : "bg-purple-50 border-purple-200 text-purple-700",

    orange:
      theme === "dark"
        ? "bg-slate-800 border-orange-700 text-orange-400"
        : "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl ${styles[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            {value}
          </h2>
        </div>

        <div className="opacity-90">
          {icon}
        </div>
      </div>
    </div>
  );
}