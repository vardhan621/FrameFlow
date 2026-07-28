import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function PublicGallery() {
  const { token } = useParams();

  const [client, setClient] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const gallery = await API.get(
        `/public-gallery/${token}`
      );

      setClient(gallery.data.client);

      const photoRes = await API.get(
        `/public-gallery/${token}/photos`
      );

      setPhotos(photoRes.data.photos);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }
  if (client && !client.galleryEnabled) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl text-red-500 font-bold">
            Gallery Disabled
          </h1>

          <p className="text-gray-400 mt-4">
            Please contact the studio.
          </p>
        </div>
      </div>
    );
  }
  if (
    client &&
    client.galleryExpiry &&
    new Date() > new Date(client.galleryExpiry)
  ) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="text-center">

          <h1 className="text-4xl text-yellow-400 font-bold">
            Gallery Expired
          </h1>

          <p className="text-gray-400 mt-4">
            Please contact the studio.
          </p>

        </div>
      </div>
    );
  }
  if (!client) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-red-500 text-2xl">
        Gallery Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl text-white font-bold">
          {client.clientName}
        </h1>

        <p className="text-gray-400 mt-2">
          {client.eventType}
        </p>

        <p className="text-gray-500">
          {new Date(client.eventDate).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-8">

          {photos.map(photo => (

            <div
              key={photo._id}
              className="rounded-xl overflow-hidden bg-slate-800"
            >

              <img
                src={photo.url}
                alt=""
                className="w-full h-60 object-cover"
              />

              {client.allowDownload && (
                <a
                  href={photo.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2"
                >
                  Download
                </a>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default PublicGallery;