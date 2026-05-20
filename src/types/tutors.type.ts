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
