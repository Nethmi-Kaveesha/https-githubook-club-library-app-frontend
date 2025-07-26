import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserFormProps {
    initialData?: {
        _id?: string;
        name: string;
        email: string;
        role: "admin" | "staff";
        isActive: boolean;
    };
    onSuccess: () => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff" as "admin" | "staff",
        isActive: true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                password: "", // don't prefill password on edit
                role: initialData.role,
                isActive: initialData.isActive,
            });
        }
    }, [initialData]);

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!formData.name.trim()) errs.name = "Name is required";
        if (!formData.email.trim()) errs.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Email is invalid";
        if (!initialData && !formData.password.trim()) {
            // Password required only on add
            errs.password = "Password is required";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            if (initialData?._id) {
                // Edit existing user - PUT or PATCH request
                await axios.put(`http://localhost:3000/api/auth/users/${initialData._id}`, {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    isActive: formData.isActive,
                    ...(formData.password ? { password: formData.password } : {}),
                });
            } else {
                // Add new user - POST request
                await axios.post("http://localhost:3000/api/auth/signup", {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    isActive: formData.isActive,
                    password: formData.password,
                });
            }

            onSuccess();

            if (!initialData) {
                // Reset form only after adding new user
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "staff",
                    isActive: true,
                });
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to save user. Please try again.");
            console.error("Error saving user", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{initialData ? "Edit User" : "Add New User"}</h2>

            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${errors.name ? "border-red-600" : "border-gray-300"}`}
                disabled={loading}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${errors.email ? "border-red-600" : "border-gray-300"}`}
                disabled={loading}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

            {!initialData && (
                <>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full px-3 py-2 border rounded ${errors.password ? "border-red-600" : "border-gray-300"}`}
                        disabled={loading}
                    />
                    {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                </>
            )}

            {/* Show password field also when editing if user wants to update password */}
            {initialData && (
                <>
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password (leave blank to keep current)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        disabled={loading}
                    />
                </>
            )}

            <select
                name="role"
                value={formData.role}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        role: e.target.value === "admin" ? "admin" : "staff",
                    })
                }
                className="w-full px-3 py-2 border rounded"
                disabled={loading}
            >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
            </select>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    disabled={loading}
                    className="w-4 h-4"
                />
                <span>Active</span>
            </label>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
                {loading ? "Saving..." : initialData ? "Update User" : "Add User"}
            </button>
        </form>
    );
};

export default UserForm;
