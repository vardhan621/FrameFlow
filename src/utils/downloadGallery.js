// ============================================
// downloadGallery.js
// ============================================

import API from "../services/api";
import { createZipName } from "./folderStructure";

export const downloadGallery = async ({
  client,
  onStart,
  onFinish,
  onError,
}) => {
  if (!client) return;

  try {
    onStart?.();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API.defaults.baseURL}/download/gallery/${client._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = createZipName(
      client.clientName,
      client.eventType
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    onFinish?.();

  } catch (error) {

    console.error(error);

    onError?.(error);

  }
};