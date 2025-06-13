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
                <div className="text-muted-foreground mb-4">
                    You need to create a category before adding bookmarks.
                </div>
                <Link
                    href={route("categories.create")}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Create Your First Category
                </Link>
            </div>
        );
    }

    // Categories exist but no bookmarks yet (either filtered or overall)
    return (
        <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
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
                    className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Clear Filters
                </button>
            ) : (
                <Link
                    href={route("bookmarks.create")}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Add Your First Bookmark
                </Link>
            )}
        </div>
    );
}
