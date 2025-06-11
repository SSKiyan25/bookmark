import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    BookmarkCollection,
    Category,
    BookmarkFilters,
    Bookmark,
} from "@/types";

import FilterBar from "./FilterBar";
import BookmarkHeader from "./BookmarkHeader";
import EmptyState from "./EmptyState";
import BookmarkGrid from "./BookmarkGrid";
import Pagination from "./Pagination";

interface MainProps {
    bookmarks: BookmarkCollection;
    categories: Category[];
    filters: BookmarkFilters;
}

export default function Main({ bookmarks, categories, filters }: MainProps) {
    const bookmarksData = Array.isArray(bookmarks)
        ? bookmarks
        : "data" in bookmarks && Array.isArray(bookmarks.data)
        ? bookmarks.data
        : [];

    const hasCategories = categories.length > 0;
    const hasActiveFilters = !!(
        filters.category_id ||
        filters.archived ||
        filters.search
    );

    const [searchQuery, setSearchQuery] = useState<string | null>(
        filters?.search || null
    );
    const [selectedCategoryName, setSelectedCategoryName] = useState<
        string | null
    >(null);

    // Set selected category name when category changes
    useEffect(() => {
        if (filters?.category_id) {
            const category = categories.find(
                (c) => c.id.toString() === filters.category_id?.toString()
            );
            setSelectedCategoryName(category?.name || null);
        } else {
            setSelectedCategoryName(null);
        }
    }, [filters?.category_id, categories]);

    // Handler for category filter change
    const handleCategoryChange = (categoryId: string | null) => {
        router.get(
            route("dashboard"),
            {
                category: categoryId,
                archived: filters?.archived,
                search: filters?.search,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Handler for archive toggle
    const handleArchivedToggle = () => {
        const newArchived = !filters.archived;
        router.get(
            route("dashboard"),
            {
                category: filters?.category_id,
                archived: newArchived ? true : null,
                search: filters?.search,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Handler for search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("dashboard"),
            {
                category: filters?.category_id,
                archived: filters?.archived,
                search: searchQuery,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Handler for search query change
    const handleSearchQueryChange = (query: string) => {
        setSearchQuery(query);
    };

    // Handler for clearing all filters
    const handleClearFilters = () => {
        setSearchQuery(null);

        router.get(
            route("dashboard"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Handler for toggling archive status
    const handleToggleArchive = (bookmark: Bookmark) => {
        if (
            confirm(
                `Are you sure you want to ${
                    bookmark.is_archived ? "unarchive" : "archive"
                } this bookmark?`
            )
        ) {
            router.patch(
                route("bookmarks.archive", bookmark.id),
                {},
                {
                    preserveState: true,
                }
            );
        }
    };

    // Handler for deleting bookmark
    const handleDelete = (bookmark: Bookmark) => {
        if (confirm("Are you sure you want to delete this bookmark?")) {
            router.delete(route("bookmarks.destroy", bookmark.id), {
                preserveState: true,
            });
        }
    };

    return (
        <div className="bg-white shadow-sm sm:rounded-lg">
            {/* Filter bar - only show if we have categories */}
            {hasCategories && (
                <FilterBar
                    categories={categories}
                    filters={filters}
                    hasActiveFilters={hasActiveFilters}
                    onCategoryChange={handleCategoryChange}
                    onArchivedToggle={handleArchivedToggle}
                    onSearch={handleSearch}
                    onSearchQueryChange={handleSearchQueryChange}
                    onClearFilters={handleClearFilters}
                    searchQuery={searchQuery}
                />
            )}

            <div className="p-6">
                {/* Header with action buttons */}
                <BookmarkHeader
                    hasCategories={hasCategories}
                    categories={categories}
                />

                {/* Content: Either empty state or bookmark grid */}
                {!hasCategories || bookmarksData.length === 0 ? (
                    <EmptyState
                        hasCategories={hasCategories}
                        hasActiveFilters={hasActiveFilters}
                        selectedCategoryName={selectedCategoryName}
                        filters={filters}
                        onClearFilters={handleClearFilters}
                    />
                ) : (
                    <BookmarkGrid
                        bookmarks={bookmarksData}
                        onToggleArchive={handleToggleArchive}
                        onDelete={handleDelete}
                    />
                )}

                {/* Pagination */}
                {bookmarks?.meta &&
                    bookmarks.meta.links &&
                    bookmarks.meta.links.length > 3 && (
                        <Pagination links={bookmarks.meta.links} />
                    )}
            </div>
        </div>
    );
}
