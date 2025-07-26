export type Reader = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    nic: string;
    address: string;
    status?: "ACTIVE" | "INACTIVE";            // match mongoose enum
    membershipType?: "STANDARD" | "PREMIUM";  // match mongoose enum
    remarks?: string;
};

export type ReaderFormData = {
    name: string;
    email: string;
    phone: string;
    nic: string;
    address: string;
    status?: "ACTIVE" | "INACTIVE";
    membershipType?: "STANDARD" | "PREMIUM";
    remarks?: string;
};
