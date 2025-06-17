import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Bookmark } from "@/types";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import {
    ExternalLink,
    Edit,
    Archive,
    Trash2,
    Package,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Undo2,
    MoreHorizontal,
} from "lucide-react";

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
    const [showFullUrl, setShowFullUrl] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Extract domain from URL for display
    const getDomain = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return domain.replace("www.", "");
        } catch {
            return url;
        }
    };

    // Copy URL to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bookmark.url);
            setIsCopied(true);
            toast.success("URL copied to clipboard!");

            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            toast.error("Failed to copy URL. Please try again.");
        }
    };

    // Check if description is long (more than 100 characters)
    const isDescriptionLong =
        bookmark.description && bookmark.description.length > 100;
    const truncatedDescription = bookmark.description?.slice(0, 100) + "...";

    return (
        <Card
            className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                bookmark.is_archived ? "bg-muted" : "bg-card"
            }`}
        >
            <CardContent className="p-5 pt-5">
                <div className="flex justify-between items-start mb-3">
                    <Badge
                        variant={bookmark.is_archived ? "outline" : "secondary"}
                        className="mb-2"
                    >
                        {bookmark.category?.name || "Uncategorized"}
                    </Badge>

                    {bookmark.is_archived && (
                        <Badge
                            variant="outline"
                            className="bg-muted text-muted-foreground"
                        >
                            <Package className="h-3 w-3 mr-1" />
                            Archived
                        </Badge>
                    )}
                </div>

                <h4 className="text-lg font-medium text-foreground mb-2 line-clamp-2">
                    {bookmark.title}
                </h4>

                <div className="flex flex-col mb-3">
                    <div className="flex items-start gap-1">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 flex-grow"
                        >
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            <span
                                className={
                                    showFullUrl
                                        ? "break-all text-xs"
                                        : "truncate"
                                }
                            >
                                {showFullUrl
                                    ? bookmark.url
                                    : getDomain(bookmark.url)}
                            </span>
                        </a>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyToClipboard}
                            className="h-5 w-5 p-0 ml-1"
                            title="Copy URL"
                        >
                            {isCopied ? (
                                <Check className="h-3 w-3 text-green-500" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullUrl(!showFullUrl)}
                        className="text-xs text-muted-foreground h-6 px-2 mt-1 self-start"
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

                {bookmark.description && (
                    <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                            {isDescriptionLong && !showFullDescription
                                ? truncatedDescription
                                : bookmark.description}
                        </p>

                        {isDescriptionLong && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setShowFullDescription(!showFullDescription)
                                }
                                className="text-xs text-muted-foreground h-6 px-2 mt-1"
                            >
                                {showFullDescription ? (
                                    <>
                                        <ChevronUp className="h-3 w-3 mr-1" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <MoreHorizontal className="h-3 w-3 mr-1" />
                                        Show More
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-2 flex justify-between items-center border-t border-border">
                <div className="flex space-x-2">
                    {!bookmark.is_archived && (
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 px-2 text-xs"
                        >
                            <Link href={route("bookmarks.edit", bookmark.id)}>
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                Edit
                            </Link>
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleArchive(bookmark)}
                        className="h-8 px-2 text-xs"
                    >
                        {bookmark.is_archived ? (
                            <>
                                <Undo2 className="h-3.5 w-3.5 mr-1" />
                                Unarchive
                            </>
                        ) : (
                            <>
                                <Archive className="h-3.5 w-3.5 mr-1" />
                                Archive
                            </>
                        )}
                    </Button>
                </div>

                {/* Only show delete button for archived bookmarks */}
                {bookmark.is_archived && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(bookmark)}
                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
