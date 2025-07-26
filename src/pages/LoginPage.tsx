import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBook, FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  forgotEmail?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingForgot, setLoadingForgot] = useState(false);

  const navigate = useNavigate();

  // Validate login form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoadingLogin(true);
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          formData,
          { withCredentials: true }
      );
      console.log("Login success!", response.data);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);

      // Show error message from backend if exists, else generic
      alert(
          error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoadingLogin(false);
    }
  };

  // Validate forgot password email
  const validateForgotEmail = (): boolean => {
    const newErrors: FormErrors = {};

    if (!forgotEmail.trim()) {
      newErrors.forgotEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      newErrors.forgotEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Forgot password submit handler
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus(null);
    setErrors({}); // Clear errors

    if (!validateForgotEmail()) return;

    setLoadingForgot(true);

    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", {
        email: forgotEmail,
      });
      setForgotStatus("If your email exists, a reset link has been sent.");
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      setForgotStatus(
          error?.response?.data?.message ||
          "Failed to send reset email. Please try again later."
      );
    } finally {
      setLoadingForgot(false);
    }
  };

  // Input change handler for both login and forgot password
  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    if (showForgotPassword && name === "forgotEmail") {
      setForgotEmail(value);
      if (errors.forgotEmail) {
        setErrors((prev) => ({ ...prev, forgotEmail: undefined }));
      }
      setForgotStatus(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    }
  };

  // Toggle between login and forgot password form
  const handleToggleForgotPassword = () => {
    setShowForgotPassword((prev) => !prev);
    setErrors({});
    setForgotStatus(null);
    setForgotEmail("");
    setFormData({ email: "", password: "" });
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-gray-900 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-md w-full bg-gray-800 shadow-lg rounded-xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col items-center">
            <FaBook className="text-teal-400 text-5xl mb-2" />
            <h2 className="text-2xl font-bold text-white">Library Manager</h2>
            <p className="mt-1 text-xs text-teal-200 text-center">
              Sign in to manage books & members
            </p>
          </div>

          {!showForgotPassword ? (
              <>
                {/* Login Form */}
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label
                        htmlFor="email"
                        className="block text-sm text-teal-100"
                    >
                      Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`mt-1 block w-full px-3 py-2 rounded-md bg-gray-700 text-sm text-white placeholder-teal-300 border ${
                            errors.email ? "border-red-500" : "border-teal-600"
                        } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                        disabled={loadingLogin}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                        htmlFor="password"
                        className="block text-sm text-teal-100"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className={`mt-1 block w-full px-3 py-2 pr-10 rounded-md bg-gray-700 text-sm text-white placeholder-teal-300 border ${
                              errors.password ? "border-red-500" : "border-teal-600"
                          } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                          disabled={loadingLogin}
                          autoComplete="current-password"
                      />
                      <button
                          type="button"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-teal-300 focus:outline-none"
                          disabled={loadingLogin}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                    )}
                  </div>

                  <button
                      type="submit"
                      className="w-full py-2 text-sm bg-teal-500 hover:bg-teal-600 rounded-md text-white font-semibold transition disabled:opacity-50"
                      disabled={loadingLogin}
                  >
                    {loadingLogin ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <p
                    className="mt-2 text-center text-sm text-teal-300 cursor-pointer hover:underline"
                    onClick={handleToggleForgotPassword}
                >
                  Forgot Password?
                </p>
              </>
          ) : (
              <>
                {/* Forgot Password Form */}
                <form
                    onSubmit={handleForgotPasswordSubmit}
                    className="space-y-4"
                    noValidate
                >
                  <label
                      htmlFor="forgotEmail"
                      className="block text-sm text-teal-100"
                  >
                    Enter your email to reset password
                  </label>
                  <input
                      id="forgotEmail"
                      name="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`mt-1 block w-full px-3 py-2 rounded-md bg-gray-700 text-sm text-white placeholder-teal-300 border ${
                          errors.forgotEmail ? "border-red-500" : "border-teal-600"
                      } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                      disabled={loadingForgot}
                      autoComplete="email"
                  />
                  {errors.forgotEmail && (
                      <p className="mt-1 text-xs text-red-400">{errors.forgotEmail}</p>
                  )}

                  {forgotStatus && (
                      <p
                          className={`mt-2 text-sm ${
                              forgotStatus.toLowerCase().includes("failed")
                                  ? "text-red-400"
                                  : "text-green-400"
                          }`}
                      >
                        {forgotStatus}
                      </p>
                  )}

                  <div className="flex justify-between items-center">
                    <button
                        type="button"
                        className="text-sm text-teal-300 hover:underline"
                        onClick={handleToggleForgotPassword}
                        disabled={loadingForgot}
                    >
                      Back to Login
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm disabled:opacity-50"
                        disabled={loadingForgot}
                    >
                      {loadingForgot ? "Sending..." : "Send Reset Email"}
                    </button>
                  </div>
                </form>
              </>
          )}

          <p className="text-center text-xs text-teal-300 mt-6">
            Don’t have an account?{" "}
            <Link
                to="/signup"
                className="font-medium text-teal-400 hover:text-teal-300 underline"
            >
              Create one
            </Link>
          </p>

          <p className="mt-4 text-center text-[11px] text-teal-500 italic">
            “A room without books is like a body without a soul.” – Cicero
          </p>
        </div>
      </div>
  );
};

export default Login;
