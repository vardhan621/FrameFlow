import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

function AddTaskModal({
  task,
  onClose,
  onSuccess,
}) {

  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    employee: "",
    client: "",
    title: "",
    description: "",
    category: "Other",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {

    loadEmployees();
    loadClients();

    if (task) {
      setFormData({
        employee: task.employee?._id || "",
        client: task.client?._id || "",
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate
          ? task.dueDate.substring(0, 10)
          : "",
      });
    }

  }, []);

  const loadEmployees = async () => {
    try {
      const res = await API.get("/employee");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadClients = async () => {
    try {
      const res = await API.get("/client");
      setClients(res.data.clients || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {

    e.preventDefault();

    try {

      if (task) {

        await API.put(
          `/task/${task._id}`,
          formData
        );

        toast.success("Task Updated");

      } else {

        await API.post(
          "/task",
          formData
        );

        toast.success("Task Assigned");

      }

      onSuccess();

    } catch (err) {

      console.log(err);

      toast.error("Failed");

    }

  };

  return (

    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

      <div className="bg-slate-900 w-full max-w-2xl rounded-xl p-6">

        <h2 className="text-2xl text-white font-bold mb-6">

          {task ? "Edit Task" : "Assign Task"}

        </h2>

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="w-full bg-slate-800 p-3 rounded text-white"
            required
          >
            <option value="">Select Employee</option>

            {employees.map((emp) => (

              <option
                key={emp._id}
                value={emp._id}
              >
                {emp.name}
              </option>

            ))}

          </select>

          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="w-full bg-slate-800 p-3 rounded text-white"
          >

            <option value="">
              Select Client (Optional)
            </option>

            {clients.map((client) => (

              <option
                key={client._id}
                value={client._id}
              >
                {client.clientName}
              </option>

            ))}

          </select>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="w-full bg-slate-800 p-3 rounded text-white"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="w-full bg-slate-800 p-3 rounded text-white"
          />

          <div className="grid md:grid-cols-3 gap-4">

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="bg-slate-800 p-3 rounded text-white"
            >

              <option>Photography</option>
              <option>Videography</option>
              <option>Editing</option>
              <option>Album Design</option>
              <option>Photo Selection</option>
              <option>Delivery</option>
              <option>Other</option>

            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="bg-slate-800 p-3 rounded text-white"
            >

              <option>Low</option>
              <option>Medium</option>
              <option>High</option>

            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="bg-slate-800 p-3 rounded text-white"
              required
            />

          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 px-5 py-2 rounded text-white"
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white"
            >
              {task ? "Update" : "Assign"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddTaskModal;