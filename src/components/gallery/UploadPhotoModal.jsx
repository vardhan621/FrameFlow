import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

function UploadPhotoModal({ onClose, onSuccess }) {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!client || !photo) {
      return toast.error("Select client and photo");
    }

    const formData = new FormData();
    formData.append("client", client);
    formData.append("photo", photo);

    try {
      setLoading(true);

      await API.post("/photo/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Photo Uploaded");

      onSuccess();
    } catch (err) {
      console.log(err);
      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-slate-900 w-full max-w-lg rounded-xl p-6">

        <h2 className="text-2xl text-white font-bold mb-6">
          Upload Photo
        </h2>

        <form onSubmit={handleUpload} className="space-y-5">

          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          >
            <option value="">Select Client</option>

            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.clientName}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full text-white"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 rounded-lg text-white"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-5 py-2 bg-blue-600 rounded-lg text-white"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UploadPhotoModal;