import { Link } from "@inertiajs/react";
import { BookmarkFilters } from "@/types";

interface EmptyStateProps {
    hasCategories: boolean;
    hasActiveFilters: boolean;
    selectedCategoryName: string | null;
    filters: BookmarkFilters;
    onClearFilters: () => void;
}

export default function EmptyState({
    hasCategories,
    hasActiveFilters,
    selectedCategoryName,
    filters,
    onClearFilters,
}: EmptyStateProps) {
    // If No categories exist yet
    if (!hasCategories) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                    You need to create a category before adding bookmarks.
                </div>
                <Link
                    href={route("categories.create")}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Create Your First Category
                </Link>
            </div>
        );
    }

    // Categories exist but no bookmarks yet (either filtered or overall)
    return (
        <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
                {hasActiveFilters ? (
                    <>
                        <p>No bookmarks found with the current filters.</p>
                        {selectedCategoryName && (
                            <p className="mt-2">
                                Category:{" "}
                                <span className="font-medium">
                                    {selectedCategoryName}
                                </span>
                            </p>
                        )}
                        {filters.search && (
                            <p className="mt-2">
                                Search:{" "}
                                <span className="font-medium">
                                    "{filters.search}"
                                </span>
                            </p>
                        )}
                        {filters.archived && (
                            <p className="mt-2">
                                Showing:{" "}
                                <span className="font-medium">
                                    Archived Only
                                </span>
                            </p>
                        )}
                    </>
                ) : (
                    "You have categories set up but no bookmarks yet. Ready to add your first bookmark?"
                )}
            </div>

            {hasActiveFilters ? (
                <button
                    onClick={onClearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Clear Filters
                </button>
            ) : (
                <Link
                    href={route("bookmarks.create")}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Your First Bookmark
                </Link>
            )}
        </div>
    );
}
