import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FiEye,
  FiPlay,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";

function TodaySchedule({ clients }) {
  const navigate = useNavigate();

  const updateShootStatus = async (id, status) => {
    try {
      await API.put(`/client/${id}/shoot-status`, {
        shootStatus: status,
      });

      toast.success(`Shoot ${status}`);

      window.location.reload();

    } catch (err) {
      console.log(err);
      toast.error("Failed to update shoot status");
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 mt-8">

      <div className="p-5 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white">
          Today's Schedule
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1200px]">

          <thead className="bg-slate-800 text-gray-300">

            <tr>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Time</th>
              <th className="p-4 text-left">Photographer</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center w-[430px]">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {clients.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-400 py-10"
                >
                  No Shoots Today
                </td>
              </tr>

            ) : (

              clients.map((client) => (

                <tr
                  key={client._id}
                  className="border-t border-slate-800 hover:bg-slate-800/40"
                >

                  <td className="p-4 font-semibold text-white">
                    {client.clientName}
                  </td>

                  <td className="p-4 text-gray-300">
                    {client.eventType}
                  </td>

                  <td className="p-4 text-gray-300">
                    {client.shootTime || "-"}
                  </td>

                  <td className="p-4 text-gray-300">
                    {client.photographer || "-"}
                  </td>

                  <td className="p-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        client.shootStatus === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : client.shootStatus === "In Progress"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {client.shootStatus || "Pending"}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">

                      {/* Start Button */}

                      <button
                        disabled={client.shootStatus !== "Pending"}
                        onClick={() =>
                          updateShootStatus(
                            client._id,
                            "In Progress"
                          )
                        }
                        className={`w-24 h-10 rounded text-white flex items-center justify-center gap-2 ${
                          client.shootStatus === "Pending"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-gray-600 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <FiPlay />
                        Start
                      </button>

                      {/* Complete Button */}

                      <button
                        disabled={client.shootStatus !== "In Progress"}
                        onClick={() =>
                          updateShootStatus(
                            client._id,
                            "Completed"
                          )
                        }
                        className={`w-28 h-10 rounded text-white flex items-center justify-center gap-2 ${
                          client.shootStatus === "In Progress"
                            ? "bg-green-600 hover:bg-green-700"
                            : client.shootStatus === "Completed"
                            ? "bg-green-800 opacity-70 cursor-not-allowed"
                            : "bg-gray-600 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <FiCheck />
                        {client.shootStatus === "Completed"
                          ? "Done"
                          : "Complete"}
                      </button>

                      {/* Map */}

                      {client.googleMapLink && (
                        <button
                          onClick={() =>
                            window.open(
                              client.googleMapLink,
                              "_blank"
                            )
                          }
                          className="w-24 h-10 bg-purple-600 hover:bg-purple-700 rounded text-white flex items-center justify-center gap-2"
                        >
                          <FiMapPin />
                          Map
                        </button>
                      )}

                      {/* Open */}

                      <button
                        onClick={() =>
                          navigate(`/clients/${client._id}`)
                        }
                        className="w-24 h-10 bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center justify-center gap-2"
                      >
                        <FiEye />
                        Open
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TodaySchedule;