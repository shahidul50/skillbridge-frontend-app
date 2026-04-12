export interface Route {
    title: string;
    items: {
        name: string;
        url: string;
        icon?: any
    }[];
}