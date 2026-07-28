import { FiX, FiDownload, FiTrash2 } from "react-icons/fi";

function ImageViewer({
  photo,
  onClose,
  onDelete,
}) {
  if (!photo) return null;

  const handleDownload = () => {
    const downloadUrl = photo.url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.download = photo.fileName || "photo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl hover:text-red-500"
      >
        <FiX />
      </button>

      <div className="max-w-6xl w-full px-6">

        {/* Image */}
        <img
          src={photo.url}
          alt={photo.fileName}
          className="max-h-[80vh] mx-auto rounded-xl shadow-2xl"
        />

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">

          <div>
            <h2 className="text-white text-lg font-semibold">
              {photo.fileName}
            </h2>
          </div>

          <div className="flex gap-4">

            {/* Download */}
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
            >
              <FiDownload />
              Download
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(photo._id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
            >
              <FiTrash2 />
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ImageViewer;