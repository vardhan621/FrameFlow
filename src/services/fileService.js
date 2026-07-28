import API from "./api";

// ==========================================
// Upload Files
// ==========================================
export const uploadFiles = (
  projectId,
  formData,
  onUploadProgress
) => {
  return API.post(
    `/files/upload/${projectId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) /
            progressEvent.total
        );

        if (onUploadProgress) {
          onUploadProgress(percent);
        }
      },
    }
  );
};

// ==========================================
// Get Project Files
// ==========================================
export const getProjectFiles = (projectId) => {
  return API.get(`/files/${projectId}`);
};

// ==========================================
// Delete File
// ==========================================
export const deleteFile = (fileId) => {
  return API.delete(`/files/${fileId}`);
};

// ==========================================
// Download Single File
// ==========================================
export const downloadFile = (fileId) => {
  return API.get(
    `/files/download/file/${fileId}`,
    {
      responseType: "blob",
    }
  );
};

// ==========================================
// Download ZIP
// ==========================================
export const downloadSelectedFiles = (fileIds) => {
  return API.post(
    "/files/download-zip",
    { fileIds },
    {
      responseType: "blob",
    }
  );
};
// ==========================================
// Rename File
// ==========================================
export const renameFile = (fileId, fileName) => {
  return API.put(`/files/rename/${fileId}`, {
    fileName,
  });
};
// ==========================================
// Get Trash Files
// ==========================================
export const getTrashFiles = (projectId) => {
  return API.get(`/files/trash/${projectId}`);
};

// ==========================================
// Restore File
// ==========================================
export const restoreFile = (fileId) => {
  return API.put(`/files/restore/${fileId}`);
};

// ==========================================
// Permanent Delete File
// ==========================================
export const permanentDeleteFile = (fileId) => {
  return API.delete(`/files/permanent/${fileId}`);
};
export const restoreAllFiles = (projectId) => {
  return API.put(`/files/restore-all/${projectId}`);
};

export const emptyTrash = (projectId) => {
  return API.delete(`/files/empty-trash/${projectId}`);
};