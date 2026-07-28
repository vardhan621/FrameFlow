function TaskTable({
  tasks,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mt-6">

      <table className="w-full">

        <thead className="bg-slate-800">

          <tr>

            <th className="p-4 text-left text-gray-300">
              Employee
            </th>

            <th className="p-4 text-left text-gray-300">
              Client
            </th>

            <th className="p-4 text-left text-gray-300">
              Task
            </th>

            <th className="p-4 text-center text-gray-300">
              Priority
            </th>

            <th className="p-4 text-center text-gray-300">
              Due Date
            </th>

            <th className="p-4 text-center text-gray-300">
              Status
            </th>

            <th className="p-4 text-center text-gray-300">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {tasks.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                className="text-center py-10 text-gray-400"
              >
                No Tasks Found
              </td>

            </tr>

          ) : (

            tasks.map((task) => (

              <tr
                key={task._id}
                className="border-t border-slate-800"
              >

                <td className="p-4 text-white">
                  {task.employee?.name || "-"}
                </td>

                <td className="p-4 text-white">
                  {task.client?.clientName || "-"}
                </td>

                <td className="p-4">

                  <p className="text-white font-semibold">
                    {task.title}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {task.category}
                  </p>

                </td>

                <td className="p-4 text-center">

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      task.priority === "High"
                        ? "bg-red-600"
                        : task.priority === "Medium"
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                  >
                    {task.priority}
                  </span>

                </td>

                <td className="p-4 text-center text-white">

                  {new Date(
                    task.dueDate
                  ).toLocaleDateString()}

                </td>

                <td className="p-4 text-center">

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      task.status === "Completed"
                        ? "bg-green-600"
                        : task.status === "In Progress"
                        ? "bg-blue-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {task.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(task)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(task)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default TaskTable;