import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { Bookmark, BookmarkCollection, PageProps } from "@/types";

interface InfiniteScrollLoaderProps {
    hasMorePages: boolean;
    currentPage: number;
    filters: {
        category_id?: string;
        archived?: boolean;
        search?: string;
    };
    onLoadMore: (newBookmarks: Bookmark[]) => void;
}

interface DashboardPageProps extends PageProps {
    bookmarks: BookmarkCollection;
}

export default function InfiniteScrollLoader({
    hasMorePages,
    currentPage,
    filters,
    onLoadMore,
}: InfiniteScrollLoaderProps) {
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMorePages && !loading) {
                    setLoading(true);

                    router.get(
                        route("dashboard"),
                        {
                            page: currentPage + 1,
                            category: filters.category_id,
                            archived: filters.archived,
                            search: filters.search,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            only: ["bookmarks"],
                            onSuccess: (page) => {
                                const pageProps =
                                    page.props as unknown as DashboardPageProps;
                                const bookmarksResponse = pageProps.bookmarks;
                                const newBookmarks =
                                    bookmarksResponse.data || [];
                                onLoadMore(newBookmarks);
                                setLoading(false);
                            },
                            onError: (errors) => {
                                console.error(
                                    "Error loading more bookmarks:",
                                    errors
                                );
                                setLoading(false);
                            },
                        }
                    );
                }
            },
            {
                threshold: 0.85, // Element must be fully visible
                rootMargin: "0px", // No margin - only trigger when actually visible
            }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasMorePages, loading, currentPage, filters]);

    if (!hasMorePages) return null;

    return (
        <div ref={observerRef} className="mt-8 flex justify-center py-4">
            {loading && (
                <div className="flex items-center text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading more bookmarks...
                </div>
            )}
        </div>
    );
}
