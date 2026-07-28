import FileCard from "./Filecard";

export default function FileGrid({
    files,
    selectedIds,
    toggleSelection,
    onPreview,
    onDownload,
    onDelete,
    onRename,
    onRestore,
    onPermanentDelete,
    isTrash,
}){
  if (files.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-20 text-center">

        <img
          src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png"
          alt="No Files"
          className="w-32 mx-auto mb-6 opacity-70"
        />

        <h2 className="text-2xl font-bold text-gray-700">
          No Files Found
        </h2>

        <p className="text-gray-500 mt-2">
          Upload your first file to get started.
        </p>

      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-6
      "
    >
      {files.map((file) => (
        <FileCard
            key={file._id}
            file={file}
            selected={selectedIds.includes(file._id)}
            toggleSelection={toggleSelection}
            onPreview={onPreview}
            onDownload={onDownload}
            onDelete={onDelete}
            onRename={onRename}
            onRestore={onRestore}
            onPermanentDelete={onPermanentDelete}
            isTrash={isTrash}
        />
      ))}
    </div>
  );
}