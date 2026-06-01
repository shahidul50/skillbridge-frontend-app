export type TRecentBooking = {
    studentName: string;
    studentEmail: string;
    studentImage: string;
    TutorName: string;
    TutorEmail: string;
    TutorImage: string;
    TutorCategories: string[];
    availabilitySlotDate: string;
    availabilitySlotStartTime: string;
    availabilitySlotEndTime: string;
    Price: number;
    Status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
};

export type TRecentPayment = {
    transactionId: string;
    StudentName: string;
    Amount: number;
    Date: string;
    Status: "SUCCESS" | "PENDING" | "FAILED";
};

export type TAdminStats = {
    totalUsers: number;
    totalTutors: number;
    totalStudents: number;
    totalBannedUsers: number;
    recentBookings: TRecentBooking[];
    recentPayments: TRecentPayment[];
};
