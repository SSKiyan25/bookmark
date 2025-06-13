import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Bookmark } from "lucide-react";

interface AddBookmarkButtonProps {
    hasCategories: boolean;
}

export default function AddBookmarkButton({
    hasCategories,
}: AddBookmarkButtonProps) {
    return (
        <Button
            asChild={hasCategories}
            disabled={!hasCategories}
            variant="default"
            className="gap-2"
        >
            <Link
                href={route("bookmarks.create")}
                className="flex items-center gap-2"
                {...(!hasCategories
                    ? {
                          "aria-disabled": true,
                          onClick: (e) => e.preventDefault(),
                      }
                    : {})}
            >
                <Bookmark className="h-4 w-4" />
                <span>Add Bookmark</span>
            </Link>
        </Button>
    );
}
