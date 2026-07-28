import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import toast from "react-hot-toast";

function Attendance() {

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employee");

      console.log("Employees API:", res.data);

      setEmployees(res.data.employees || []);
    } catch (err) {
      console.log("Employee Error:", err.response?.data || err);
    }
  };

  const checkIn = async () => {
    if (!selectedEmployee)
      return toast.error("Select Employee");

    try {
      console.log("Selected Employee:", selectedEmployee);

      const res = await API.post("/attendance/checkin", {
        employee: selectedEmployee,
      });

      console.log("CheckIn Success:", res.data);

      toast.success("Checked In");

      fetchAttendance();

    } catch (err) {

      console.log("CheckIn Error:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
        "Check In Failed"
      );
    }
  };

  const checkOut = async () => {
    if (!selectedEmployee)
      return toast.error("Select Employee");

    try {

      const res = await API.post("/attendance/checkout", {
        employee: selectedEmployee,
      });

      console.log("CheckOut Success:", res.data);

      toast.success("Checked Out");

      fetchAttendance();

    } catch (err) {

      console.log("CheckOut Error:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
        "Check Out Failed"
      );
    }
  };

  const fetchAttendance = async () => {

    try {

      const res = await API.get("/attendance/today");

      setAttendance(res.data.attendance || []);

    } catch (err) {

      console.log(err);

    }

  };

  

  return (

    <Layout>

      <h1 className="text-3xl font-bold text-white mb-8">
        Attendance
      </h1>

      {/* Top Card */}

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">

        <div className="flex flex-wrap gap-4">

          <select
            value={selectedEmployee}
            onChange={(e) =>
              setSelectedEmployee(e.target.value)
            }
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white w-80"
          >

            <option value="">
              Select Employee
            </option>

            {employees.map((emp) => (

              <option
                key={emp._id}
                value={emp._id}
              >
                {emp.name}
              </option>

            ))}

          </select>

          <button
            onClick={checkIn}
            className="bg-green-600 hover:bg-green-700 px-6 rounded-lg text-white"
          >
            Check In
          </button>

          <button
            onClick={checkOut}
            className="bg-red-600 hover:bg-red-700 px-6 rounded-lg text-white"
          >
            Check Out
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-slate-900 rounded-xl border border-slate-800 mt-8 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800 text-gray-300">

            <tr>

              <th className="p-4 text-left">
                Employee
              </th>

              <th className="p-4">
                Check In
              </th>

              <th className="p-4">
                Check Out
              </th>

              <th className="p-4">
                Hours
              </th>

              <th className="p-4">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {attendance.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-400"
                >
                  No Attendance Today
                </td>

              </tr>

            ) : (

              attendance.map((item) => (

                <tr
                  key={item._id}
                  className="border-t border-slate-800"
                >

                 <td className="p-4">

                    <p className="text-white font-semibold">
                      {item.employee?.name}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {item.employee?.role}
                    </p>

                  </td>

                  <td className="p-4 text-center text-green-400">

                    {item.checkIn
                      ? new Date(
                          item.checkIn
                        ).toLocaleTimeString()
                      : "-"}

                  </td>

                  <td className="p-4 text-center text-yellow-400">

                    {item.checkOut
                      ? new Date(
                          item.checkOut
                        ).toLocaleTimeString()
                      : "-"}

                  </td>

                  <td className="p-4 text-center text-cyan-400">

                    {item.workingHours || 0} hrs

                  </td>

                  <td className="p-4 text-center">

                    <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full">

                      {item.status}

                    </span>

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

export default Attendance;