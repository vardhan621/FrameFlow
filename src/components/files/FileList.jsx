import {
  FaDownload,
  FaTrash,
  FaEye,
  FaFilePdf,
  FaFileAlt,
  FaPlay,
  FaEdit,
} from "react-icons/fa";

export default function FileList({
  files,
  onPreview,
  onDownload,
  onDelete,
  onRename,
}){
  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Category</th>
            <th className="text-left p-4">Size</th>
            <th className="text-left p-4">Date</th>
            <th className="text-center p-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {files.map((file) => {

            const isImage = file.category.includes("Images");
            const isVideo = file.category.includes("Videos");
            const isPdf = file.category === "Album PDF";

            return (

              <tr
                key={file._id}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="p-4 flex items-center gap-3">

                  {isImage ? (
                    <img
                      src={`http://localhost:5000${file.fileUrl}`}
                      className="w-12 h-12 rounded object-cover"
                      alt=""
                    />
                  ) : isVideo ? (
                    <FaPlay className="text-purple-600 text-2xl" />
                  ) : isPdf ? (
                    <FaFilePdf className="text-red-600 text-2xl" />
                  ) : (
                    <FaFileAlt className="text-blue-600 text-2xl" />
                  )}

                  <span>{file.fileName}</span>

                </td>

                <td className="p-4">{file.category}</td>

                <td className="p-4">
                  {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                </td>

                <td className="p-4">
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => onPreview(file)}
                      title="Preview"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => onDownload(file)}
                      title="Download"
                    >
                      <FaDownload />
                    </button>

                    <button
                      onClick={() => onRename(file)}
                      title="Rename"
                    >
                      <FaEdit className="text-green-600" />
                    </button>

                    <button
                      onClick={() => onDelete(file)}
                      title="Delete"
                    >
                      <FaTrash className="text-red-600" />
                    </button>

                  </div>

                </td>

              </tr>

            );
          })}

        </tbody>

      </table>

    </div>
  );
}