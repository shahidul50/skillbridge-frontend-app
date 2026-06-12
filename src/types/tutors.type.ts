export interface GetTutorParams {
    limit?: number;
    page?: number;
    searchTerm?: string;
    categories?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    [key: string]: string | number | undefined;
}

export interface IWeeklyAvailableSlot {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface ITutorUser {
    name: string;
    image: string;
}

export interface ITutorCategoryDetail {
    id: string;
    name: string;
}

export interface ITutorCategory {
    id: string;
    tutorProfileId: string;
    categoryId: string;
    createdAt: string;
    category: ITutorCategoryDetail;
}

export interface ITutorSelectedCategory {
    id: string;
    name: string;
}

export interface ITutorDetails {
    id: string;
    userId: string;
    title: string;
    bio: string;
    hourlyRate: number;
    experience: string;
    rating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
    user: ITutorUser;
    reviews: any[];
    tutorCategories: ITutorCategory[];
    totalClassHours: number;
    totalUniqueStudents: number;
    tutorSelectedCategory: ITutorSelectedCategory[];
}

export interface AvailabilitySlot {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}


//dashboard stats types

type TDashboardStats = {
    totalSessions: {
        value: number;
        growth: number;
    },
    totalEarnings: {
        value: number;
        growth: number;
    },
    avgRating: {
        value: number;
        status: string;
    },
    newBookings: {
        value: number;
        badge: string;
    }
}

type TDashboardUpcomingSession = {
    bookingId: string;
    studentName: string;
    categories: string[];
    slotStartTime: string;
    slotEndTime: string;
    startTimeISO: string;
    meetingLink: string | null;
}

export type TDashboardMetaResponse = {
    tutorName: string;
    todayUpcomingSessionsCount: number;
    stats: TDashboardStats;
    upcomingSessions: TDashboardUpcomingSession[];
}

export type TDashboardRevenueTrend = {
    month: string;
    revenue: number;
}

export type TDashboardRevenueTrendResponse = {
    revenueTrends: TDashboardRevenueTrend[];
}

export type TDashboardRevenueTrendParams = {
    trendPeriod: "one-week" | "one-month" | "three-month" | "six-month" | "this-year" | "all-time"
}