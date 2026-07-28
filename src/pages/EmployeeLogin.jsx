import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function EmployeeLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        "/employee/login",
        formData
      );

      // ============================
      // Clear Admin Session
      // ============================

      localStorage.removeItem("token");
      localStorage.removeItem("studio");

      // ============================
      // Save Employee Session
      // ============================

      localStorage.setItem(
        "employeeToken",
        res.data.token
      );

      localStorage.setItem(
        "employee",
        JSON.stringify(res.data.employee)
      );

      toast.success("Login Successful");

      navigate("/employee/dashboard");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-xl w-[400px]"
      >

        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Employee Login
        </h1>

        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-6"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Login"}
        </button>

      </form>

    </div>
  );
}

export default EmployeeLogin;