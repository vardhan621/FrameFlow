import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import UploadPhotoModal from "../components/gallery/UploadPhotoModal";
import ImageViewer from "../components/gallery/ImageViewer";
import API from "../services/api";
import toast from "react-hot-toast";
import { FiDownload } from "react-icons/fi";

function Gallery() {
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await API.get("/client");
      setClients(res.data.clients);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPhotos = async (clientId) => {
    if (!clientId) {
      setPhotos([]);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(`/photo/${clientId}`);

      setPhotos(res.data.photos);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };
  const downloadAllPhotos = async () => {
    if (!selectedClient) {
      return toast.error("Select a client first");
    }

    try {
      setDownloading(true);

      const response = await API.get(
        `/download/gallery/${selectedClient}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "Gallery.zip"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Download Started");

    } catch (err) {
      console.log(err);
      toast.error("Download Failed");
    } finally {
      setDownloading(false);
    }
  };

  const deletePhoto = async (id) => {
    if (!window.confirm("Delete this photo?")) return;

    try {
      await API.delete(`/photo/${id}`);

      toast.success("Photo Deleted");

      setSelectedPhoto(null);

      fetchPhotos(selectedClient);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete photo");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Gallery
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Upload Photos
        </button>
        <button
          onClick={downloadAllPhotos}
          disabled={downloading || !selectedClient}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          {downloading ? "Preparing ZIP..." : "📦 Download All"}
        </button>
      </div>

      {/* Client Select */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <select
          value={selectedClient}
          onChange={(e) => {
            setSelectedClient(e.target.value);
            fetchPhotos(e.target.value);
          }}
          className="w-full md:w-96 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="">Select Client</option>

          {clients.map((client) => (
            <option
              key={client._id}
              value={client._id}
            >
              {client.clientName}
            </option>
          ))}
        </select>
      </div>

      {/* Gallery */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

        {loading ? (

          <div className="text-center py-20 text-gray-400">
            Loading Photos...
          </div>

        ) : photos.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20">

            <div className="text-7xl mb-4">
              📸
            </div>

            <h2 className="text-2xl font-bold text-white">
              No Photos Found
            </h2>

            <p className="text-gray-400 mt-2">
              Upload photos for this client.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

            {photos.map((photo) => (

              <div
                key={photo._id}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-xl hover:scale-105 hover:shadow-blue-500/20 duration-300 cursor-pointer"
              >

                <img
                  src={photo.url}
                  alt={photo.fileName}
                  onClick={() => setSelectedPhoto(photo)}
                  className="w-full h-72 object-cover"
                />

                <div className="p-3">

                  <p className="text-white text-sm truncate">
                    {photo.fileName}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Upload Modal */}
      {showModal && (
        <UploadPhotoModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);

            if (selectedClient) {
              fetchPhotos(selectedClient);
            }
          }}
        />
      )}

      {/* Image Viewer */}
      {selectedPhoto && (
        <ImageViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={deletePhoto}
        />
      )}
    </Layout>
  );
}

export default Gallery;