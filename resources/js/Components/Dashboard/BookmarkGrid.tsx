import { Bookmark } from "@/types";
import BookmarkCard from "./BookmarkCard";

interface BookmarkGridProps {
    bookmarks: Bookmark[];
    onToggleArchive: (bookmark: Bookmark) => void;
    onDelete: (bookmark: Bookmark) => void;
}

export default function BookmarkGrid({
    bookmarks,
    onToggleArchive,
    onDelete,
}: BookmarkGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onToggleArchive={onToggleArchive}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
