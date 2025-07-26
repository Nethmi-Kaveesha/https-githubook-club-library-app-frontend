import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import type { Reader } from "../../types/Reader";

interface ReaderFormProps {
    reader?: Reader | null;
    onSubmit: (readerData: Omit<Reader, "_id">) => void;
}

interface ReaderFormData {
    name: string;
    email: string;
    phone: string;
    nic: string;
    address: string;
    status: "ACTIVE" | "INACTIVE" | "";
    membershipType: "STANDARD" | "PREMIUM" | "";
    remarks: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    nic?: string;
    address?: string;
    status?: string;
    membershipType?: string;
}

const ReaderForm = forwardRef<HTMLFormElement, ReaderFormProps>(({ reader, onSubmit }, ref) => {
    const [formData, setFormData] = useState<ReaderFormData>({
        name: "",
        email: "",
        phone: "",
        nic: "",
        address: "",
        status: "",
        membershipType: "",
        remarks: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (reader) {
            setFormData({
                name: reader.name || "",
                email: reader.email || "",
                phone: reader.phone || "",
                nic: reader.nic || "",
                address: reader.address || "",
                status: reader.status ?? "",
                membershipType: reader.membershipType ?? "",
                remarks: reader.remarks || "",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                nic: "",
                address: "",
                status: "",
                membershipType: "",
                remarks: "",
            });
        }
        setErrors({});
    }, [reader]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.nic.trim()) newErrors.nic = "NIC is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";

        if (!formData.status) newErrors.status = "Status is required";
        if (!formData.membershipType) newErrors.membershipType = "Membership type is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const cleanedData: Omit<Reader, "_id"> = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                nic: formData.nic.trim(),
                address: formData.address.trim(),
                status: formData.status as "ACTIVE" | "INACTIVE",
                membershipType: formData.membershipType as "STANDARD" | "PREMIUM",
                remarks: formData.remarks.trim(),
            };
            onSubmit(cleanedData);
        }
    };

    const formRef = React.useRef<HTMLFormElement>(null);
    useImperativeHandle(ref, () => formRef.current as HTMLFormElement);

    const formDataRecord = formData as unknown as Record<string, string>;

    return (
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-4" noValidate>
            {[
                { label: "Name", name: "name", placeholder: "Full name" },
                { label: "Email", name: "email", placeholder: "example@gmail.com" },
                { label: "Phone", name: "phone", placeholder: "0771234567" },
                { label: "NIC", name: "nic", placeholder: "901234567V" },
                { label: "Address", name: "address", placeholder: "Colombo, Sri Lanka" },
            ].map(({ label, name, placeholder }) => (
                <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-teal-400 mb-1">
                        {label}
                    </label>
                    <input
                        type={name === "email" ? "email" : "text"}
                        id={name}
                        name={name}
                        value={formDataRecord[name] ?? ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-black text-teal-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            errors[name as keyof FormErrors] ? "border-red-600" : "border-teal-700"
                        }`}
                        placeholder={placeholder}
                        autoComplete="off"
                    />
                    {errors[name as keyof FormErrors] && (
                        <p className="mt-1 text-sm text-red-600">{errors[name as keyof FormErrors]}</p>
                    )}
                </div>
            ))}

            <div>
                <label className="block text-sm font-medium text-teal-400 mb-1">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-black text-teal-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.status ? "border-red-600" : "border-teal-700"
                    }`}
                >
                    <option value="">-- Select Status --</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-teal-400 mb-1">Membership Type</label>
                <select
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-black text-teal-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.membershipType ? "border-red-600" : "border-teal-700"
                    }`}
                >
                    <option value="">-- Select Membership Type --</option>
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                </select>
                {errors.membershipType && (
                    <p className="mt-1 text-sm text-red-600">{errors.membershipType}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-teal-400 mb-1">Remarks</label>
                <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black text-teal-300 border border-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Any notes (optional)"
                    autoComplete="off"
                />
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
                Save Reader
            </button>
        </form>
    );
});

export default ReaderForm;
