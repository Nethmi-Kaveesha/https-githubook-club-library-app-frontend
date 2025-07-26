import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'staff';
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!['admin', 'staff'].includes(formData.role)) {
      newErrors.role = 'Role must be either admin or staff';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { name, email, password, role, isActive } = formData;

      const now = new Date().toISOString();

      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        name,
        email,
        password,
        role,
        isActive,
        createdAt: now,
        updatedAt: now,
      });

      console.log('Signup success:', response.data);
      navigate('/login');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(`Signup failed: ${error.response.data.message}`);
      } else {
        alert('Signup failed. Please try again.');
      }
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;

    const checked = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-gray-900 flex items-center justify-center px-3">
        <div className="max-w-md w-full bg-gray-800 shadow-lg rounded-xl p-6 space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
            <p className="mt-1 text-sm text-teal-200">Join us and manage your library efficiently</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-teal-100">
                Full Name
              </label>
              <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`mt-1 block w-full px-3 py-2 rounded-md bg-gray-700 text-white text-sm placeholder-teal-400 border ${
                      errors.name ? 'border-red-500' : 'border-teal-600'
                  } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                  disabled={loading}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-teal-100">
                Email Address
              </label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`mt-1 block w-full px-3 py-2 rounded-md bg-gray-700 text-white text-sm placeholder-teal-400 border ${
                      errors.email ? 'border-red-500' : 'border-teal-600'
                  } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                  disabled={loading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm text-teal-100">
                Password
              </label>
              <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`mt-1 block w-full px-3 py-2 rounded-md bg-gray-700 text-white text-sm placeholder-teal-400 border ${
                      errors.password ? 'border-red-500' : 'border-teal-600'
                  } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                  disabled={loading}
              />
              <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-teal-400 hover:text-teal-300 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.943-9.544-7a9.967 9.967 0 012.248-3.451m2.525-2.5A9.97 9.97 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.674 3.243M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                )}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password with toggle */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm text-teal-100">
                Confirm Password
              </label>
              <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`mt-1 block w-full px-3 py-2 rounded-md bg-gray-700 text-white text-sm placeholder-teal-400 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-teal-600'
                  } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                  disabled={loading}
              />
              <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-teal-400 hover:text-teal-300 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.943-9.544-7a9.967 9.967 0 012.248-3.451m2.525-2.5A9.97 9.97 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.674 3.243M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                )}
              </button>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Role selector */}
            <div>
              <label htmlFor="role" className="block text-sm text-teal-100">
                Role
              </label>
              <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 rounded-md bg-gray-700 text-white text-sm border ${
                      errors.role ? 'border-red-500' : 'border-teal-600'
                  } focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-150`}
                  disabled={loading}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
            </div>

            {/* isActive checkbox */}
            <div className="flex items-center space-x-2">
              <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 bg-gray-700 border-teal-600 rounded focus:ring-teal-400"
                  disabled={loading}
              />
              <label htmlFor="isActive" className="text-sm text-teal-100 select-none">
                Active
              </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-xs text-teal-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
  );
};

export default Signup;
