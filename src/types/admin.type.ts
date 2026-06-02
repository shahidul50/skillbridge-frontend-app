export type TRecentBooking = {
    studentName: string;
    studentEmail: string;
    studentImage: string;
    tutorName: string;
    tutorEmail: string;
    tutorImage: string;
    tutorCategories: string[];
    availabilitySlotDate: string;
    availabilitySlotStartTime: string;
    availabilitySlotEndTime: string;
    price: number;
    status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
};

export type TRecentPayment = {
    transactionId: string;
    studentName: string;
    amount: number;
    date: string;
    status: "SUCCESS" | "PENDING" | "FAILED";
};

export type TAdminStatsResponse = {
    totalUsers: number;
    totalTutors: number;
    totalStudents: number;
    totalBannedUsers: number;
    recentBookings: TRecentBooking[];
    recentPayments: TRecentPayment[];
};

export type TUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    image: string;
    createdAt: string;
};

export interface TUserParams {
    limit?: number;
    page?: number;
    searchTerm?: string;
    isActive?: boolean;
    role?: string;
}

export type TUserResponse = {
    data: TUser[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export type TTutorProfileResponse = {
    tutorName: string;
    tutorEmail: string;
    tutorImage: string;
    role: string;
    joiningDate: string;
    status: string;
    tutorTitle: string;
    experience: string;
    phoneNumber: string;
    hourlyRate: number;
    rating: number;
    totalReviews: number;
    totalSession: string;
    totalStudentTaught: string;
    bio: string;
}


export type TStudentRecentBooking = {
    date: string;
    tutorName: string;
    subject: string[];
    status: string;
}

export type TStudentRecentPayment = {
    transactionId: string;
    amount: number;
    submittedDate: string;
    status: string;
}

export type TStudentProfileResponse = {
    studentName: string;
    studentEmail: string;
    studentImage: string;
    role: string;
    joiningDate: string;
    accountStatus: string;
    phoneNumber: string;
    totalBookings: string;
    recentPayments: TStudentRecentPayment[];
    recentBookings: TStudentRecentBooking[];
}

export enum UserRole {
    TUTOR = "TUTOR",
    STUDENT = "STUDENT",
    ADMIN = "ADMIN",
}

// booking types

export type TBooking = {
    bookingId: string;
    studentName: string;
    studentEmail: string;
    tutorName: string;
    tutorEmail: string;
    tutorCategoryName: string[];
    availabilitySlotDate: string;
    availabilitySlotStartTime: string;
    availabilitySlotEndTime: string;
    amount: number;
    bookingStatus: string;
}

export type TBookingResponse = {
    data: TBooking[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface TBookingParams {
    limit?: number;
    page?: number;
    searchTerm?: string;
    bookingStatus?: string;
}

export type TBookingStatsResponse = {
    totalBookings: number;
    bookingGrowthMetric: number;
    pendingBooking: number;
    totalCompletedSession: number;
    sessionSuccessRate: number;
    uncompletedBooking: number;
}

export type TBookingReciptResponse = {
    invoiceId: string;
    bookingId: string;
    studentName: string;
    studentEmail: string;
    tutorName: string;
    tutorEmail: string;
    tutorCategoryName: string;
    bookingStatus: string;
    availabilitySlotDate: string;
    availabilitySlotStartTime: string;
    availabilitySlotEndTime: string;
    paidAmount: number;
    paymentMethod: string;
    transactionId: string;
}


//payments types

export type TPayment = {
    paymentId: string;
    transactionId: string;
    studentName: string;
    tutorName: string;
    tutorCategoryName: string[];
    paymentSummitedDate: string;
    amount: number;
    status: string;
}

export type TPaymentResponse = {
    data: TPayment[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface TPaymentParams {
    limit?: number;
    page?: number;
    searchTerm?: string;
    status?: "SUCCESS" | "PENDING" | "FAILED";
}

export type TPaymentStatsResponse = {
    totalEarning: number;
    earningGrowthMetric: number;
    totalPendingPayments: number;
    pendingPaymentGrowthMetric: number;
    totalSuccessfulPayments: number;
    successfulPaymentGrowthMetric: number;
    totalFailedPayments: number;
    failedPaymentGrowthMetric: number;
}


export type TPaymentVerifyStatus = "SUCCESS" | "FAILED";


export type TPaymentAccount = {
    id: string;
    method: string;
    accountNumber: string;
    accountType: string;
    isActive: boolean;
}

export type TPaymentAccountResponse = {
    data: TPaymentAccount[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export type TPaymentAccountParams = {
    limit?: number;
    page?: number;
    searchTerm?: string;
    isActive?: boolean;
}


export type TCreatePaymentAccount = {
    method: "BKASH" | "NAGAD" | "ROCKET";
    accountNumber: string;
    accountType: "PERSONAL" | "MERCHANT";
}

export type TUpdatePaymentAccount = {
    method: "BKASH" | "NAGAD" | "ROCKET";
    accountNumber: string;
    accountType: "PERSONAL" | "MERCHANT";
    isActive: boolean;
}

