import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    PageProps,
    BookmarkCollection,
    Category,
    BookmarkFilters,
    CategoryCollection,
} from "@/types";
import Main from "@/Components/Dashboard/Main";

interface DashboardProps extends PageProps {
    bookmarks: BookmarkCollection;
    categories: CategoryCollection | Category[];
    filters: BookmarkFilters;
}

export default function Dashboard({
    bookmarks,
    categories = [],
    filters = { category_id: null, archived: null, search: null },
}: DashboardProps) {
    // Process data to ensure consistent format
    const categoriesData = Array.isArray(categories)
        ? categories
        : "data" in categories && Array.isArray(categories.data)
        ? categories.data
        : [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Bookmark Saver
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Main
                        bookmarks={bookmarks}
                        categories={categoriesData}
                        filters={filters}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
