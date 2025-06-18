import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    BookmarkCollection,
    Category,
    BookmarkFilters,
    Bookmark,
    PageProps,
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
import { toast } from "sonner";

import FilterBar from "./FilterBar";
import BookmarkHeader from "./BookmarkHeader";
import EmptyState from "./EmptyState";
import BookmarkGrid from "./BookmarkGrid";
import BookmarkList from "./BookmarkList";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

interface MainProps {
    bookmarks: BookmarkCollection;
    categories: Category[];
    filters: BookmarkFilters;
}

interface DashboardPageProps extends PageProps {
    bookmarks: BookmarkCollection;
    categories: Category[];
    filters: BookmarkFilters;
}

export default function Main({ bookmarks, categories, filters }: MainProps) {
    const initialBookmarksData = bookmarks?.data || [];

    const [allBookmarks, setAllBookmarks] =
        useState<Bookmark[]>(initialBookmarksData);

    const [paginationMeta, setPaginationMeta] = useState(
        bookmarks?.meta || null
    );

    // View mode state
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const { props } = usePage<DashboardPageProps>();

    // Reset bookmarks when filters change (page 1)
    useEffect(() => {
        const currentBookmarks = props.bookmarks;
        const newBookmarks = currentBookmarks?.data || [];
        const newMeta = currentBookmarks?.meta;

        if (newMeta?.current_page === 1) {
            setAllBookmarks(newBookmarks);
            setPaginationMeta(newMeta);
        }
    }, [filters]);

    // Filter bookmarks
    const filteredBookmarks = filters.archived
        ? allBookmarks
        : allBookmarks.filter((bookmark) => !bookmark.is_archived);

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

    // Handler for view mode change
    const handleViewModeChange = (mode: "grid" | "list") => {
        setViewMode(mode);
        localStorage.setItem("bookmarkViewMode", mode);
    };

    // Load saved view mode on component mount
    useEffect(() => {
        const savedViewMode = localStorage.getItem("bookmarkViewMode") as
            | "grid"
            | "list";
        if (
            savedViewMode &&
            (savedViewMode === "grid" || savedViewMode === "list")
        ) {
            setViewMode(savedViewMode);
        }
    }, []);

    // Handler for loading more bookmarks (infinite scroll)
    const handleLoadMore = (newBookmarks: Bookmark[]) => {
        setAllBookmarks((prev) => {
            const currentBookmarks = Array.isArray(prev) ? prev : [];
            return [...currentBookmarks, ...newBookmarks];
        });

        if (paginationMeta) {
            setPaginationMeta({
                ...paginationMeta,
                current_page: paginationMeta.current_page + 1,
            });
        }
    };

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
        toast.success(
            `${newArchived ? "Showing" : "Hiding"} archived bookmarks`
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
            const isArchiving = !activeBookmark.is_archived;

            router.patch(
                route("bookmarks.archive", activeBookmark.id),
                {},
                {
                    preserveState: true,
                    onSuccess: () => {
                        // Update the bookmark in our local state
                        setAllBookmarks((prev) =>
                            prev.map((bookmark) =>
                                bookmark.id === activeBookmark.id
                                    ? {
                                          ...bookmark,
                                          is_archived: !bookmark.is_archived,
                                      }
                                    : bookmark
                            )
                        );

                        // Show success toast
                        toast.success(
                            isArchiving
                                ? `"${activeBookmark.title}" has been archived successfully.`
                                : `"${activeBookmark.title}" has been unarchived successfully.`
                        );
                    },
                    onError: (errors) => {
                        // Show error toast
                        toast.error(
                            isArchiving
                                ? "Failed to archive bookmark. Please try again."
                                : "Failed to unarchive bookmark. Please try again."
                        );
                        console.error("Archive error:", errors);
                    },
                }
            );
            setIsArchiveDialogOpen(false);
        }
    };

    // Handler for deleting bookmark
    const handleDelete = () => {
        if (activeBookmark) {
            const bookmarkTitle = activeBookmark.title;

            router.delete(route("bookmarks.destroy", activeBookmark.id), {
                preserveState: true,
                onSuccess: () => {
                    // Remove the bookmark from the local state
                    setAllBookmarks((prev) =>
                        prev.filter(
                            (bookmark) => bookmark.id !== activeBookmark.id
                        )
                    );
                    toast.success(
                        `"${bookmarkTitle}" has been deleted successfully.`
                    );
                },
                onError: (errors) => {
                    toast.error("Failed to delete bookmark. Please try again.");
                    console.error("Delete error:", errors);
                },
            });
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="bg-card shadow-sm sm:rounded-lg p-8 sm:p-4">
            {/* Filter bar that will only show if ther are categories */}
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
                {/* Header with the action buttons and view toggle */}
                <BookmarkHeader
                    hasCategories={hasCategories}
                    categories={categories}
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                />

                {/* Either show empty state or the bookmark grid/list */}
                {!hasCategories || filteredBookmarks.length === 0 ? (
                    <EmptyState
                        hasCategories={hasCategories}
                        hasActiveFilters={hasActiveFilters}
                        selectedCategoryName={selectedCategoryName}
                        filters={filters}
                        onClearFilters={handleClearFilters}
                    />
                ) : (
                    <>
                        {/* Conditional rendering based on view mode */}
                        {viewMode === "grid" ? (
                            <BookmarkGrid
                                bookmarks={filteredBookmarks}
                                onToggleArchive={openArchiveDialog}
                                onDelete={openDeleteDialog}
                            />
                        ) : (
                            <BookmarkList
                                bookmarks={filteredBookmarks}
                                onToggleArchive={openArchiveDialog}
                                onDelete={openDeleteDialog}
                            />
                        )}

                        {/* Infinite Scroll Loader */}
                        <InfiniteScrollLoader
                            hasMorePages={
                                paginationMeta?.current_page != null &&
                                paginationMeta?.last_page != null &&
                                paginationMeta.current_page <
                                    paginationMeta.last_page
                            }
                            currentPage={paginationMeta?.current_page || 1}
                            filters={{
                                category_id: filters.category_id || undefined,
                                archived: filters.archived || undefined,
                                search: filters.search || undefined,
                            }}
                            onLoadMore={handleLoadMore}
                        />
                    </>
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
