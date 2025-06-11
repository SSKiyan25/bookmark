export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    bookmarks_count?: number;
    created_at: string;
    updated_at: string;
    data?: Category; // Self-referential for API resource structure
}

export interface CategoryCollection {
    data: Category[];
}