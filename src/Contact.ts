interface Contact {
    id: number;
    name: string;
    phoneNumber: string;
    role: string;
    companyId: number; // Foreign key to Company.id
}