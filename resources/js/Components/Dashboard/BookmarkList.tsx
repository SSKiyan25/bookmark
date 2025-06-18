import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Bookmark } from "@/types";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    ExternalLink,
    Edit,
    Archive,
    Trash2,
    Package,
    Copy,
    Check,
    Undo2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

interface BookmarkListProps {
    bookmarks: Bookmark[];
    onToggleArchive: (bookmark: Bookmark) => void;
    onDelete: (bookmark: Bookmark) => void;
}

export default function BookmarkList({
    bookmarks,
    onToggleArchive,
    onDelete,
}: BookmarkListProps) {
    return (
        <div className="space-y-3">
            <AnimatePresence mode="popLayout">
                {bookmarks.map((bookmark, index) => (
                    <motion.div
                        key={bookmark.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                            opacity: 0,
                            x: -20,
                            transition: { duration: 0.2 },
                        }}
                        transition={{
                            duration: 0.3,
                            delay: index < 10 ? index * 0.05 : 0,
                            layout: { duration: 0.3 },
                        }}
                    >
                        <BookmarkListItem
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

interface BookmarkListItemProps {
    bookmark: Bookmark;
    onToggleArchive: (bookmark: Bookmark) => void;
    onDelete: (bookmark: Bookmark) => void;
}

function BookmarkListItem({
    bookmark,
    onToggleArchive,
    onDelete,
}: BookmarkListItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [showFullUrl, setShowFullUrl] = useState(false);

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return url;
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bookmark.url);
            setIsCopied(true);
            toast.success("URL copied to clipboard!");
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy URL");
        }
    };

    const hasDescription =
        bookmark.description && bookmark.description.trim().length > 0;
    const isDescriptionLong =
        hasDescription && bookmark.description!.length > 150;
    const shortDescription = bookmark.description?.slice(0, 150) + "...";

    return (
        <Card
            className={`group transition-all duration-200 hover:shadow-md hover:border-primary/20 ${
                bookmark.is_archived ? "bg-muted/50 border-muted" : "bg-card"
            }`}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-grow min-w-0 space-y-3">
                        {/* Header with badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant={
                                    bookmark.is_archived ? "outline" : "default"
                                }
                                className="text-xs"
                            >
                                {bookmark?.category.data?.name}
                            </Badge>
                            {bookmark.is_archived && (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-muted-foreground"
                                >
                                    <Package className="h-3 w-3 mr-1" />
                                    Archived
                                </Badge>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <h3 className="font-semibold text-lg leading-tight text-foreground mb-1">
                                {bookmark.title}
                            </h3>
                        </div>

                        {/* URL Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 font-medium min-w-0"
                                    title={bookmark.url}
                                >
                                    <span
                                        className={
                                            showFullUrl
                                                ? "break-all text-xs"
                                                : "truncate block"
                                        }
                                    >
                                        {showFullUrl
                                            ? bookmark.url
                                            : getDomain(bookmark.url)}
                                    </span>
                                </a>
                            </div>

                            {/* Toggle full URL button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFullUrl(!showFullUrl)}
                                className="text-xs text-muted-foreground h-6 px-2 -ml-2"
                            >
                                {showFullUrl ? (
                                    <>
                                        <ChevronUp className="h-3 w-3 mr-1" />
                                        Hide Full URL
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                        Show Full URL
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Description */}
                        {hasDescription && (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {isDescriptionLong && !isExpanded
                                        ? shortDescription
                                        : bookmark.description}
                                </p>

                                {isDescriptionLong && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                        className="text-xs text-primary hover:text-primary/80 h-6 px-2 -ml-2"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="h-3 w-3 mr-1" />
                                                Show Less
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-3 w-3 mr-1" />
                                                Read More
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyToClipboard}
                            className="h-9 w-9 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                            title="Copy URL"
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>

                        {!bookmark.is_archived && (
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-9 w-9 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                                title="Edit Bookmark"
                            >
                                <Link
                                    href={route("bookmarks.edit", bookmark.id)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleArchive(bookmark)}
                            className="h-9 w-9 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                            title={
                                bookmark.is_archived ? "Unarchive" : "Archive"
                            }
                        >
                            {bookmark.is_archived ? (
                                <Undo2 className="h-4 w-4" />
                            ) : (
                                <Archive className="h-4 w-4" />
                            )}
                        </Button>

                        {bookmark.is_archived && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(bookmark)}
                                className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 opacity-60 group-hover:opacity-100 transition-opacity"
                                title="Delete Bookmark"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
