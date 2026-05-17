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
