import InputField from "../components/common/InputField";
import Logo from"../components/ui/Logo";
import LoadingButton from "../components/common/LoadingButton";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studioName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
  
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.studioName.trim()) {
      newErrors.studioName = "Studio Name is required";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone Number must be 10 digits";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        studioName: formData.studioName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success(res.data.message);

      navigate("/");

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl p-8">

        <Logo/>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <InputField
            label="Studio Name"
            type="text"
            name="studioName"
            value={formData.studioName}
            onChange={handleChange}
            placeholder="Enter Studio Name"
            error={errors.studioName}
          />
          <InputField
            label="Owner Name"
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Enter Owner Name"
            error={errors.ownerName}
          />
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
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);

              setFormData({
                ...formData,
                phone: value,
              });
            }}
            placeholder="Enter Phone Number"
            leftIcon={<FaPhone />}
            error={errors.phone}
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
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
            error={errors.password}
          />
          <InputField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            leftIcon={<FaLock />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
            error={errors.confirmPassword}
          />
          <LoadingButton loading={loading}>
             Register →
          </LoadingButton>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;