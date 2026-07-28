import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/common/InputField";
import LoadingButton from "../components/common/LoadingButton";
import Logo from "../components/ui/Logo";
import toast from "react-hot-toast";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [errors, setErrors] = useState({});
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  }

  if (!formData.password.trim()) {
    newErrors.password = "Password is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  try {
    setLoading(true);

    const res = await API.post("/auth/login", formData);

    // ===============================
    // Clear Employee Session
    // ===============================

    localStorage.removeItem("employee");
    localStorage.removeItem("employeeToken");

    // ===============================
    // Save Admin Session
    // ===============================

    localStorage.setItem("token", res.data.token);

    if (res.data.studio) {
      localStorage.setItem(
        "studio",
        JSON.stringify(res.data.studio)
      );
    }

    toast.success(res.data.message);

    navigate("/dashboard");

  } catch (err) {

    toast.error(
      err.response?.data?.message || "Login Failed"
    );

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl p-8">

        <Logo />

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              leftIcon={<MdEmail />}
              error={errors.email}
          />

          <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                leftIcon={<FaLock />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                }
                error={errors.password}
          />
          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-gray-400 text-sm">

              <input
                type="checkbox"
                className="accent-blue-600"
              />

              Remember Me

            </label>

            <button
              type="button"
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Forgot Password?
            </button>

          </div>
          <LoadingButton loading={loading}>
             Login →
          </LoadingButton>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have a studio account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;