import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    BookmarkCollection,
    Category,
    BookmarkFilters,
    Bookmark,
} from "@/types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

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
    // Extract bookmarks data from the collection
    const bookmarksData = Array.isArray(bookmarks)
        ? bookmarks
        : "data" in bookmarks && Array.isArray(bookmarks.data)
        ? bookmarks.data
        : [];

    // Filter bookmarks based on archive status if not explicitly showing archived
    const filteredBookmarks = filters.archived
        ? bookmarksData
        : bookmarksData.filter((bookmark) => !bookmark.is_archived);

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

    // State for alert dialogs
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null);

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

    // Initialize archive dialog
    const openArchiveDialog = (bookmark: Bookmark) => {
        setActiveBookmark(bookmark);
        setIsArchiveDialogOpen(true);
    };

    // Initialize delete dialog
    const openDeleteDialog = (bookmark: Bookmark) => {
        setActiveBookmark(bookmark);
        setIsDeleteDialogOpen(true);
    };

    // Handler for toggling archive status
    const handleToggleArchive = () => {
        if (activeBookmark) {
            router.patch(
                route("bookmarks.archive", activeBookmark.id),
                {},
                {
                    preserveState: true,
                }
            );
            setIsArchiveDialogOpen(false);
        }
    };

    // Handler for deleting bookmark
    const handleDelete = () => {
        if (activeBookmark) {
            router.delete(route("bookmarks.destroy", activeBookmark.id), {
                preserveState: true,
            });
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="bg-card shadow-sm sm:rounded-lg p-8 sm:p-4">
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

            <div className="p-4">
                {/* Header with action buttons */}
                <BookmarkHeader
                    hasCategories={hasCategories}
                    categories={categories}
                />

                {/* Content: Either empty state or bookmark grid */}
                {!hasCategories || filteredBookmarks.length === 0 ? (
                    <EmptyState
                        hasCategories={hasCategories}
                        hasActiveFilters={hasActiveFilters}
                        selectedCategoryName={selectedCategoryName}
                        filters={filters}
                        onClearFilters={handleClearFilters}
                    />
                ) : (
                    <BookmarkGrid
                        bookmarks={filteredBookmarks}
                        onToggleArchive={openArchiveDialog}
                        onDelete={openDeleteDialog}
                    />
                )}

                {/* Pagination */}
                {bookmarks?.meta &&
                    bookmarks.meta.links &&
                    bookmarks.meta.links.length > 3 && (
                        <Pagination links={bookmarks.meta.links} />
                    )}
            </div>

            {/* Archive Alert Dialog */}
            <AlertDialog
                open={isArchiveDialogOpen}
                onOpenChange={setIsArchiveDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {activeBookmark?.is_archived
                                ? "Unarchive"
                                : "Archive"}{" "}
                            Bookmark
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to{" "}
                            {activeBookmark?.is_archived
                                ? "unarchive"
                                : "archive"}
                            "{activeBookmark?.title}"?
                            {!activeBookmark?.is_archived &&
                                " It will be moved to your archive."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleArchive}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {activeBookmark?.is_archived
                                ? "Unarchive"
                                : "Archive"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Alert Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "
                            {activeBookmark?.title}"? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
