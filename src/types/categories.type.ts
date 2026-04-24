export interface Category {
    data: {
        id: string;
        name: string;
        image: string;
    }[],
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}


export interface GetCategoryParams {
    searchTerm?: string;
    limit?: number;
    page?: number;
}

export interface ServiceOptions {
    cache?: RequestCache;
    revalidate?: number;
}