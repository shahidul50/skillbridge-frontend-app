export type TGetDashboardMetaDataResponse = {
    stats: {
        studentName: string,
        totalHoursLearned: string,
        upcomingSessionsCount: {
            thisWeekCount: number,
            todayCount: number
        },
        activeSessions: {
            count: number,
            pendingModules: number
        },
        unreviewedBookings: {
            count: number,
            pendingFeedbackSessions: number
        }
    }
};


type TGetUpcomingSessions = {
    bookingId: string;
    categories: string[];
    tutorName: string;
    tutorImage: string | null;
    slotStartTime: string;
    slotEndTime: string;
    startTimeISO: string;
    meetingLink: string | null;
};

export type TGetUpcomingSessionsResponse = TGetUpcomingSessions[];


type TRecentBookingItem = {
    bookingId: string;
    tutorName: string;
    tutorImage: string | null;
    tutorTitle: string;
    categories: string[];
    availabilitySlotDate: string;
    slotStartTime: string;
    slotEndTime: string;
    status: "CONFIRMED" | "COMPLETED" | "PENDING" | "CANCELLED";
    amount: number;
}

export type TGetRecentBookingsResponse = TRecentBookingItem[];