import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import FolderSection from "./FolderSection";
import GalleryPreviewModal from "./GalleryPreviewModal";
import { GALLERY_FOLDERS } from "../../../utils/folderStructure";

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

        {/* Download Button */}

        <div className="flex justify-end">

          <button
            onClick={downloadGallery}
            disabled={downloading}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md ${
              downloading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            } ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {downloading
              ? "Downloading..."
              : "Download Gallery"}
          </button>

        </div>

        {/* Folder Sections */}

        <div
          className={`rounded-3xl border shadow-2xl p-6 transition-all duration-300 ${
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