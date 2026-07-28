import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import toast from "react-hot-toast";

import AddTaskModal from "../components/task/AddTaskModal";
import TaskTable from "../components/task/TaskTable";

function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const res = await API.get("/task");

      setTasks(res.data.tasks || []);

    } catch (err) {

      console.log(err);

      toast.error("Failed to load tasks");

    } finally {

      setLoading(false);

    }

  };

  const handleDelete = async (task) => {

    if (!window.confirm(`Delete "${task.title}" ?`))
      return;

    try {

      await API.delete(`/task/${task._id}`);

      toast.success("Task Deleted");

      fetchTasks();

    } catch (err) {

      console.log(err);

      toast.error("Delete Failed");

    }

  };

  const filteredTasks = tasks.filter((task) => {

    const text = search.toLowerCase();

    return (

      task.title?.toLowerCase().includes(text) ||

      task.employee?.name?.toLowerCase().includes(text) ||

      task.client?.clientName?.toLowerCase().includes(text)

    );

  });

  return (

    <Layout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-white">

          Task Management

        </h1>

        <button
          onClick={() => {

            setSelectedTask(null);

            setShowModal(true);

          }}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white"
        >
          + Assign Task
        </button>

      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-6">

        <input
          type="text"
          placeholder="Search Task..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
        />

      </div>

      <TaskTable
        tasks={filteredTasks}
        loading={loading}
        onEdit={(task) => {

          setSelectedTask(task);

          setShowModal(true);

        }}
        onDelete={handleDelete}
      />

      {showModal && (

        <AddTaskModal

          task={selectedTask}

          onClose={() => {

            setShowModal(false);

            setSelectedTask(null);

          }}

          onSuccess={() => {

            fetchTasks();

            setShowModal(false);

            setSelectedTask(null);

          }}

        />

      )}

    </Layout>

  );

}

export default Tasks;