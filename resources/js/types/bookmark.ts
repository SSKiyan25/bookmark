import { Category } from './category';

export interface Bookmark {
    id: number;
    title: string;
    url: string;
    description: string;
    category_id: number;
    category: Category;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    data?: Bookmark; // Self-referential for API resource structure
}

export interface BookmarkCollection {
    data: Bookmark[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}