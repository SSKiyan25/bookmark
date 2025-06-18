import { Bookmark } from "@/types";
import BookmarkCard from "./BookmarkCard";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            <AnimatePresence>
                {bookmarks.map((bookmark, index) => (
                    <motion.div
                        key={bookmark.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            duration: 0.3,
                            delay: index < 12 ? index * 0.05 : 0,
                        }}
                    >
                        <BookmarkCard
                            bookmark={bookmark}
                            onToggleArchive={onToggleArchive}
                            onDelete={onDelete}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
