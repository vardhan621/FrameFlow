import API from "../../services/api";
import toast from "react-hot-toast";

function ShootTable({
  clients,
  loading,
  refresh,
}) {

  const completeShoot = async (client) => {

    try {

      await API.put(`/client/${client._id}`, {
        shootStatus: "Completed",
        editingStatus: "In Progress",
      });

      toast.success("Shoot Completed");

      refresh();

    } catch (error) {
      console.log(error);
      toast.error("Failed");
    }

  };

  return (

    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-800">

          <tr>

            <th className="p-4 text-left text-gray-300">Client</th>

            <th className="p-4 text-left text-gray-300">Event</th>

            <th className="p-4 text-left text-gray-300">Date</th>

            <th className="p-4 text-left text-gray-300">Photographer</th>

            <th className="p-4 text-left text-gray-300">Videographer</th>

            <th className="p-4 text-left text-gray-300">Status</th>

            <th className="p-4 text-left text-gray-300">Action</th>

          </tr>

        </thead>

        <tbody>

          {loading ? (

            <tr>
              <td
                colSpan="7"
                className="text-center p-6 text-gray-400"
              >
                Loading...
              </td>
            </tr>

          ) : clients.length === 0 ? (

            <tr>
              <td
                colSpan="7"
                className="text-center p-6 text-gray-400"
              >
                No Shoots Found
              </td>
            </tr>

          ) : (

            clients.map((client) => (

              <tr
                key={client._id}
                className="border-t border-slate-800"
              >

                <td className="p-4 text-white">
                  {client.clientName}
                </td>

                <td className="p-4 text-gray-300">
                  {client.eventType}
                </td>

                <td className="p-4 text-gray-300">
                  {new Date(client.eventDate).toLocaleDateString()}
                </td>

                <td className="p-4 text-gray-300">
                  {client.photographer || "-"}
                </td>

                <td className="p-4 text-gray-300">
                  {client.videographer || "-"}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      client.shootStatus === "Completed"
                        ? "bg-green-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {client.shootStatus}
                  </span>

                </td>

                <td className="p-4">

                  {client.shootStatus !== "Completed" ? (

                    <button
                      onClick={() => completeShoot(client)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Complete
                    </button>

                  ) : (

                    <span className="text-green-400 font-semibold">
                      ✔ Done
                    </span>

                  )}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default ShootTable;