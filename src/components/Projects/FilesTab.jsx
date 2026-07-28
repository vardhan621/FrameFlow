import { useEffect, useState, useRef, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  getProjectFiles,
  getTrashFiles,
  restoreFile,
  permanentDeleteFile,
  uploadFiles,
  deleteFile,
  downloadFile,
  downloadSelectedFiles,
  renameFile,
  restoreAllFiles,
  emptyTrash,
} from "../../services/fileService";

import FolderSidebar from "../files/FolderSidebar";
import StatsCards from "../files/StatsCards";
import Toolbar from "../files/Toolbar";
import FileGrid from "../files/FileGrid";
import PreviewModal from "../files/PreviewModal";
import UploadZone from "../files/UploadZone";
import toast from "react-hot-toast";
import FileList from "../files/FileList";
function FilesTab({ projectId }) {

  // ==============================
  // States
  // ==============================
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [category, setCategory] =
    useState("Raw Images");

  const [selectedCategory, setSelectedCategory] =
    useState("Raw Images");

  const [selectedFiles, setSelectedFiles] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [viewMode, setViewMode] =
    useState("grid");
  const [previewFile, setPreviewFile] = useState(null);
 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedIds, setSelectedIds] = useState([]);
  const [fileToDelete, setFileToDelete] = useState(null);  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };
  const clearSelection = () => {
    setSelectedIds([]);
  };
  // ==============================
  // Load Files
  // ==============================

  useEffect(() => {
    fetchFiles();
  }, [projectId, selectedCategory]);

  const fetchFiles = async () => {
  try {
    setLoading(true);

    const res =
      selectedCategory === "Trash"
        ? await getTrashFiles(projectId)
        : await getProjectFiles(projectId);

    console.log("Fetched Files:", res.data.files);

    setFiles(res.data.files || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // ==============================
  // Search + Category Filter
  // ==============================

    const filteredFiles = useMemo(() => {
      let result = files.filter((file) => {
      const categoryMatch =
        selectedCategory === "Trash"
          ? true
          : file.category === selectedCategory;
        const searchMatch = file.fileName
          .toLowerCase()
          .includes(search.toLowerCase());

        return categoryMatch && searchMatch;
      });
      console.log("Selected Category:", selectedCategory);
      console.log("Filtered Files:", result);
      switch (sortBy) {
        case "newest":
          result.sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;

        case "oldest":
          result.sort(
            (a, b) =>
              new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;

        case "nameAsc":
          result.sort((a, b) =>
            a.fileName.localeCompare(b.fileName)
          );
          break;

        case "nameDesc":
          result.sort((a, b) =>
            b.fileName.localeCompare(a.fileName)
          );
          break;

        case "sizeLarge":
          result.sort(
            (a, b) =>
              (b.fileSize || 0) - (a.fileSize || 0)
          );
          break;

        case "sizeSmall":
          result.sort(
            (a, b) =>
              (a.fileSize || 0) - (b.fileSize || 0)
          );
          break;

        default:
          break;
      }

      return result;
    }, [files, selectedCategory, search, sortBy]);
    const allSelected =
      filteredFiles.length > 0 &&
      filteredFiles.every((file) => selectedIds.includes(file._id));

    const toggleSelectAll = () => {
      if (allSelected) {
        setSelectedIds((prev) =>
          prev.filter(
            (id) => !filteredFiles.some((file) => file._id === id)
          )
        );
      } else {
        const ids = filteredFiles.map((file) => file._id);

        setSelectedIds((prev) => [
          ...new Set([...prev, ...ids]),
        ]);
      }
    };
     // ==============================
      // Preview Navigation
      // ==============================

      const previewIndex = filteredFiles.findIndex(
        (file) => file._id === previewFile?._id
      );

      const handleNextPreview = () => {
        if (previewIndex === -1) return;

        const nextIndex =
          (previewIndex + 1) % filteredFiles.length;

        setPreviewFile(filteredFiles[nextIndex]);
      };

      const handlePrevPreview = () => {
        if (previewIndex === -1) return;

        const prevIndex =
          (previewIndex - 1 + filteredFiles.length) %
          filteredFiles.length;

        setPreviewFile(filteredFiles[prevIndex]);
      };

  // ==============================
  // Statistics
  // ==============================

  const totalStorage = files.reduce(
    (sum, file) =>
      sum + (file.fileSize || 0),
    0
  );

  const imageCount =
    files.filter((file) =>
      file.category.includes("Images")
    ).length;

  const videoCount =
    files.filter((file) =>
      file.category.includes("Videos")
    ).length;

  const documentCount =
    files.filter(
      (file) =>
        file.category === "Documents" ||
        file.category === "Album PDF"
    ).length;

  // ==============================
  // Download
  // ==============================

  const handleDownload = async (file) => {
  try {
    const response = await downloadFile(file._id);

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = file.fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    toast.success("Download Started");

  } catch (err) {
    console.error(err);
    toast.error("Download Failed");
  }
};

  // ==============================
  // Upload
  // ==============================

  const handleUpload = async () => {

    if (
      !selectedFiles ||
      selectedFiles.length === 0
    ) {

      toast.error("Please select files");
      return;

    }

    try {

      const formData =
        new FormData();

      formData.append(
        "category",
        category
      );

      for (
        let i = 0;
        i < selectedFiles.length;
        i++
      ) {

        formData.append(
          "files",
          selectedFiles[i]
        );

      }

      await uploadFiles(
        projectId,
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      toast.success(
        "Files Uploaded Successfully"
      );

      setSelectedFiles(null);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

      if (fileInputRef.current) {

        fileInputRef.current.value =
          "";

      }

      fetchFiles();

    } catch (err) {

      console.error(err);
      setUploadProgress(0);

      toast.error(
        err.response?.data?.message ||
          "Upload Failed"
      );

    }

  };
const handleRestoreAll = async () => {

  try {

    await restoreAllFiles(projectId);

    toast.success("All Files Restored");

    fetchFiles();

  } catch (err) {

    console.error(err);

    toast.error("Restore All Failed");

  }

};

const handleEmptyTrash = async () => {

  if (
    !window.confirm(
      "Delete all files permanently?"
    )
  )
    return;

  try {

    await emptyTrash(projectId);

    toast.success("Trash Emptied");

    setSelectedIds([]);

    fetchFiles();

  } catch (err) {

    console.error(err);

    toast.error("Empty Trash Failed");

  }

};
  // ==============================
  // Delete
  // ==============================
const openDeleteModal = (file) => {
  console.log(file);

  if (!file || !file._id) {
    toast.error("Invalid file");
    return;
  }

  setFileToDelete(file);
};
  const handleDelete = async (id) => {
  console.log("Delete ID:", id);

  if (!id) {
    toast.error("Invalid file ID");
    return;
  }

  try {
    await deleteFile(id);

    toast.success("File Deleted Successfully");

    setSelectedIds((prev) =>
      prev.filter((item) => item !== id)
    );

    fetchFiles();

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Delete Failed");
  }
};
  const handleBulkDelete = async () => {
  if (selectedIds.length === 0) return;

  try {
    setIsBulkDeleting(true);

    if (selectedCategory === "Trash") {

        await Promise.all(
            selectedIds.map((id) => permanentDeleteFile(id))
        );

    } else {

        await Promise.all(
            selectedIds.map((id) => deleteFile(id))
        );

    }

    toast.success("Files Deleted Successfully");

    setSelectedIds([]);

    fetchFiles();

  } catch (err) {

    console.error(err);

    toast.error("Bulk Delete Failed");

  } finally {

    setIsBulkDeleting(false);
    setShowBulkDeleteModal(false);

  }
};
    const handleBulkDownload = async () => {

      if (selectedIds.length === 0) {
        toast.error("Select files first");
        return;
      }

      try {

        const response =
          await downloadSelectedFiles(selectedIds);

        const blob = new Blob([response.data], {
          type: "application/zip",
        });

        const url = window.URL.createObjectURL(blob);

        let fileName = "Download.zip";

        const disposition =
          response.headers["content-disposition"];

        if (disposition) {

          const match =
            disposition.match(/filename="?([^"]+)"?/);

          if (match) {
            fileName = match[1];
          }

        }

        const link =
          document.createElement("a");

        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        toast.success("ZIP Download Started");

      } catch (err) {

        console.error(err);

        toast.error("ZIP Download Failed");

      }

    };
    const handleBulkRestore = async () => {

  if (selectedIds.length === 0) return;

  try {

    await Promise.all(
      selectedIds.map((id) => restoreFile(id))
    );

    toast.success("Files Restored Successfully");

    setSelectedIds([]);

    fetchFiles();

  } catch (err) {

    console.error(err);

    toast.error("Bulk Restore Failed");

  }

};
    // ==============================
    // Rename
    // ==============================

    const handleRename = async (file) => {
      const newName = window.prompt(
        "Enter new file name",
        file.fileName
      );

      if (!newName || newName.trim() === "") return;

      if (newName === file.fileName) return;

      try {
        await renameFile(file._id, newName);

        toast.success("File renamed successfully");

        fetchFiles();

      } catch (err) {
        console.error(err);

        toast.error(
          err.response?.data?.message ||
          "Rename failed"
        );
      }
    };
    const handleRestore = async (file) => {
      try {
        await restoreFile(file._id);
        toast.success("File Restored Successfully");
        fetchFiles();
      } catch (err) {
        console.error(err);
        toast.error("Restore Failed");
      }
    };

    const handlePermanentDelete = async (file) => {
      try {
        await permanentDeleteFile(file._id);
        toast.success("File Deleted Permanently");
        fetchFiles();
      } catch (err) {
        console.error(err);
        toast.error("Permanent Delete Failed");
      }
    };

  // ==============================
// Loading
// ==============================

  if (loading) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-96 transition ${
          theme === "dark"
            ? "bg-slate-900"
            : "bg-slate-100"
        }`}
      >
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent"></div>

        <p
          className={`mt-4 font-medium ${
            theme === "dark"
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          Loading files...
        </p>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900"
          : "bg-slate-100"
      }`}
    >

      {/* Breadcrumb */}
      <div className="mb-6">
        <p
          className={`text-sm ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          Dashboard / Projects / Files
        </p>

        <h1
          className={`text-3xl font-bold mt-2 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Project File Manager
        </h1>
      </div>

      {/* Statistics */}
      <StatsCards files={files} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

        {/* Left Sidebar */}
        <div className="lg:col-span-3">

          <FolderSidebar
            files={files}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Right Section */}
        <div className="lg:col-span-9 space-y-6">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5"
              />

              <span
                className={`font-semibold ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                Select All ({filteredFiles.length})
              </span>
            </label>
          </div>
          {selectedIds.length > 0 && (
            <div
              className={`rounded-2xl p-4 flex justify-between items-center border ${
                theme === "dark"
                  ? "bg-blue-900/20 border-blue-700"
                  : "bg-blue-50 border-blue-200"
              }`}
            >

              <h3
                className={`font-semibold ${
                  theme === "dark"
                    ? "text-blue-300"
                    : "text-blue-700"
                }`}
              >
                {selectedIds.length} Files Selected
              </h3>

              <div className="flex gap-3">

                {selectedCategory === "Trash" ? (

                  <>
                    <button
                      onClick={handleBulkRestore}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                    >
                      Restore Selected
                    </button>

                    <button
                      onClick={() => setShowBulkDeleteModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                    >
                      Delete Permanently
                    </button>
                  </>

                ) : (

                  <button
                    onClick={() => setShowBulkDeleteModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                  >
                    Move to Trash
                  </button>

                )}
                <button
                  onClick={handleBulkDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                  Download ZIP
                </button>
                <button
                  onClick={clearSelection}
                  className={`px-4 py-2 rounded-xl transition ${
                    theme === "dark"
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Clear
                </button>

              </div>

            </div>
          )}
          <Toolbar
            search={search}
            setSearch={setSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Upload Card */}
          <UploadZone
              category={category}
              setCategory={setCategory}
              fileInputRef={fileInputRef}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              handleUpload={handleUpload}
              uploadProgress={uploadProgress}
          />
          {/* Files */}
          <div
            className={`rounded-2xl shadow-lg p-6 ${
              theme === "dark"
                ? "bg-slate-800"
                : "bg-white"
            }`}
          >

            <div className="flex justify-between items-center mb-5">

            <div>
              <h2
                className={`text-xl font-bold ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {selectedCategory}
              </h2>

             <span
                className={`text-sm ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {filteredFiles.length} Files
              </span>
            </div>

            {selectedCategory === "Trash" && (
              <div className="flex gap-3">

                <button
                  onClick={handleRestoreAll}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                >
                  Restore All
                </button>

                <button
                  onClick={handleEmptyTrash}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                >
                  Empty Trash
                </button>

              </div>
            )}

          </div>
            {filteredFiles.length === 0 ? (

              <div
                className={`text-center py-16 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                No files found.
              </div>

            ) : viewMode === "grid" ? (

              <FileGrid
                  files={filteredFiles}
                  selectedIds={selectedIds}
                  toggleSelection={toggleSelection}
                  onPreview={setPreviewFile}
                  onDownload={handleDownload}
                  onDelete={openDeleteModal}
                  onRename={handleRename}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                  isTrash={selectedCategory === "Trash"}
              />

            ) : (

              <FileList
                files={filteredFiles}
                onPreview={setPreviewFile}
                onDownload={handleDownload}
                onDelete={openDeleteModal}
                onRename={handleRename}
              />

            )}

          </div>

        </div>

      </div>
      <PreviewModal
        isOpen={!!previewFile}
        file={previewFile}
        files={filteredFiles}
        onSelect={setPreviewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
        onDeleteRequest={setFileToDelete}
        onNext={handleNextPreview}
        onPrevious={handlePrevPreview}
        currentIndex={previewIndex}
        totalFiles={filteredFiles.length}
      />
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div
            className={`rounded-2xl shadow-2xl w-[420px] p-6 transition ${
              theme === "dark"
                ? "bg-slate-800"
                : "bg-white"
            }`}
          >

            <div className="text-center">

              <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                theme === "dark"
                  ? "bg-red-900/30"
                  : "bg-red-100"
              }`}
              >
                <span className="text-5xl">🗑</span>
              </div>

              <h2
                className={`text-2xl font-bold mt-5 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Delete File?
              </h2>

              <p
                className={`mt-3 font-semibold break-all ${
                  theme === "dark"
                    ? "text-gray-200"
                    : "text-gray-800"
                }`}
              >
                {fileToDelete.fileName}
              </p>

              <p
                className={`mt-2 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                This action cannot be undone.
              </p>

            </div>

            <div className="flex gap-3 mt-8">

              <button
                onClick={() => setFileToDelete(null)}
                className={`flex-1 rounded-xl py-3 border transition ${
                  theme === "dark"
                    ? "border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>

              <button
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);

                  await handleDelete(fileToDelete._id);

                  setIsDeleting(false);

                  setFileToDelete(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>
        </div>
      )}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div
            className={`rounded-2xl shadow-2xl w-[430px] p-6 transition ${
              theme === "dark"
                ? "bg-slate-800"
                : "bg-white"
            }`}
          >

            <div className="text-center">

              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                  theme === "dark"
                    ? "bg-red-900/30"
                    : "bg-red-100"
                }`}
              >
                <span className="text-5xl">🗑</span>
              </div>

              <h2
                className={`text-2xl font-bold mt-5 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Delete Selected Files?
              </h2>

              <p
                className={`mt-3 font-semibold ${
                  theme === "dark"
                    ? "text-gray-200"
                    : "text-gray-800"
                }`}
              >
                {selectedIds.length} files will be permanently deleted.
              </p>

              <p
                className={`mt-2 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                This action cannot be undone.
              </p>

            </div>

            <div className="flex gap-3 mt-8">

              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className={`flex-1 rounded-xl py-3 border transition ${
                  theme === "dark"
                    ? "border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>

              <button
                disabled={isBulkDeleting}
                onClick={handleBulkDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3"
              >
                {isBulkDeleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default FilesTab;

