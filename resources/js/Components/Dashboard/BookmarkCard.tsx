import { Link } from "@inertiajs/react";
import { Bookmark } from "@/types";

interface BookmarkCardProps {
    bookmark: Bookmark;
    onToggleArchive: (bookmark: Bookmark) => void;
    onDelete: (bookmark: Bookmark) => void;
}

export default function BookmarkCard({
    bookmark,
    onToggleArchive,
    onDelete,
}: BookmarkCardProps) {
    return (
        <div
            className={`border rounded-lg overflow-hidden shadow-sm ${
                bookmark.is_archived ? "bg-gray-50" : "bg-white"
            }`}
        >
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-900 mb-1 truncate">
                        {bookmark.title}
                    </h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {bookmark.category?.name || "Uncategorized"}
                    </span>
                </div>

                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-900 truncate block mb-2"
                >
                    {bookmark.url}
                </a>

                {bookmark.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                        {bookmark.description}
                    </p>
                )}

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <Link
                            href={route("bookmarks.edit", bookmark.id)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() => onToggleArchive(bookmark)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50"
                        >
                            {bookmark.is_archived ? "Unarchive" : "Archive"}
                        </button>
                    </div>

                    <button
                        onClick={() => onDelete(bookmark)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-red-600 bg-white hover:bg-gray-50"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
