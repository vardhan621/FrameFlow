export const getExtension = (url = "") => {
  try {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const parts = cleanUrl.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  } catch {
    return "";
  }
};

export const isImage = (url = "") => {
  const ext = getExtension(url);

  return [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
    "svg",
    "avif",
  ].includes(ext);
};

export const isVideo = (url = "") => {
  const ext = getExtension(url);

  return [
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
    "m4v",
    "3gp",
  ].includes(ext);
};

// ================= PDF Detection =================
export const isPdf = (file) => {
  if (!file) return false;

  const url =
    typeof file === "string"
      ? file
      : file.url || "";

  const publicId =
    typeof file === "object"
      ? file.public_id || ""
      : "";

  return (
    getExtension(url) === "pdf" ||
    url.toLowerCase().includes(".pdf") ||
    url.toLowerCase().includes("/raw/upload/") ||
    publicId.toLowerCase().includes("album")
  );
};

export const getFileName = (file = {}) => {
  return (
    file.originalName ||
    file.name ||
    file.filename ||
    file.public_id?.split("/").pop() ||
    "Untitled"
  );
};

export const getDownloadUrl = (url = "") => {
  if (!url) return "";

  if (url.includes("/upload/")) {
    return url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );
  }

  return url;
};