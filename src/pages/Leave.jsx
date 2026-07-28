import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import toast from "react-hot-toast";

function Leave() {

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {

    try {

      const res = await API.get("/leave");

      setLeaves(res.data.leaves || []);

    } catch (err) {

      console.log(err);

    }

  };

  const approve = async (id) => {

    try {

      await API.put(`/leave/${id}/approve`);

      toast.success("Leave Approved");

      fetchLeaves();

    } catch (err) {

      toast.error("Failed");

    }

  };

  const reject = async (id) => {

    try {

      await API.put(`/leave/${id}/reject`);

      toast.success("Leave Rejected");

      fetchLeaves();

    } catch (err) {

      toast.error("Failed");

    }

  };

  return (

    <Layout>

      <h1 className="text-3xl font-bold text-white mb-8">
        Leave Management
      </h1>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="p-4 text-left text-gray-300">
                Employee
              </th>

              <th className="p-4 text-gray-300">
                Date
              </th>

              <th className="p-4 text-gray-300">
                Type
              </th>

              <th className="p-4 text-gray-300">
                Reason
              </th>

              <th className="p-4 text-gray-300">
                Status
              </th>

              <th className="p-4 text-gray-300">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {leaves.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-400"
                >
                  No Leave Requests
                </td>

              </tr>

            ) : (

              leaves.map((leave) => (

                <tr
                  key={leave._id}
                  className="border-t border-slate-800"
                >

                  <td className="p-4 text-white">

                    {leave.employee?.name}

                    <div className="text-gray-400 text-sm">

                      {leave.employee?.role}

                    </div>

                  </td>

                  <td className="p-4 text-center text-white">

                    {new Date(
                      leave.date
                    ).toLocaleDateString()}

                  </td>

                  <td className="p-4 text-center text-cyan-400">

                    {leave.leaveType}

                  </td>

                  <td className="p-4 text-center text-gray-300">

                    {leave.reason}

                  </td>

                  <td className="p-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full ${
                        leave.status === "Approved"
                          ? "bg-green-600/20 text-green-400"
                          : leave.status === "Rejected"
                          ? "bg-red-600/20 text-red-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {leave.status}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    {leave.status === "Pending" && (

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            approve(leave._id)
                          }
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            reject(leave._id)
                          }
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                        >
                          Reject
                        </button>

                      </div>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </Layout>

  );

}

export default Leave;