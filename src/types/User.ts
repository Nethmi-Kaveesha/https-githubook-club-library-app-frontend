export type User = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "staff";
    isActive: boolean;
    password?: string; // Optional for edit/display purposes
};

export type UserFormData = {
    name: string;
    email: string;
    role: "admin" | "staff";
    isActive: boolean;
    password?: string; // Optional for edit (required during signup)
};
