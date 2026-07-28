// ===============================
// folderStructure.js
// ===============================

export const GALLERY_FOLDERS = [
  {
    key: "rawPhotos",
    name: "Raw Photos",
    icon: "📷",
    multiple: true,
    accept: "image/*",
  },
  {
    key: "rawVideos",
    name: "Raw Videos",
    icon: "🎥",
    multiple: true,
    accept: "video/*",
  },
  {
    key: "editedPhotos",
    name: "Edited Photos",
    icon: "🖼️",
    multiple: true,
    accept: "image/*",
  },
  {
    key: "finalVideos",
    name: "Final Videos",
    icon: "🎬",
    multiple: true,
    accept: "video/*",
  },
  {
    key: "albumPdf",
    name: "Album PDF",
    icon: "📄",
    multiple: false,
    accept: ".pdf",
  },
];

export const createClientFolderName = (
  clientName = "",
  eventType = ""
) => {
  return `${clientName}_${eventType}`
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "");
};

export const createZipName = (
  clientName = "",
  eventType = ""
) => {
  return `${createClientFolderName(
    clientName,
    eventType
  )}.zip`;
};

export const ZIP_STRUCTURE = [
  "Raw Photos",
  "Raw Videos",
  "Edited Photos",
  "Final Videos",
  "Album PDF",
];

export const STORAGE_KEYS = {
  rawPhotos: "Raw Photos",
  rawVideos: "Raw Videos",
  editedPhotos: "Edited Photos",
  finalVideos: "Final Videos",
  albumPdf: "Album PDF",
};