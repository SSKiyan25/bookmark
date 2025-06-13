import { Bookmark } from "@/types";
import BookmarkCard from "./BookmarkCard";
import { motion } from "framer-motion";

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark, index) => (
                <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <BookmarkCard
                        bookmark={bookmark}
                        onToggleArchive={onToggleArchive}
                        onDelete={onDelete}
                    />
                </motion.div>
            ))}
        </div>
    );
}
