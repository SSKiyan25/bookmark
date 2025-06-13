import { router } from "@inertiajs/react";
import { Category } from "@/types";
import { useState } from "react";
import { Grid2X2 } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import CategoryLimitIndicator from "./CategoryLimitIndicator";
import AddBookmarkButton from "./AddBookmarkButton";
import CategoryDeleteDialog from "./CategoryDeleteDialog";

interface BookmarkHeaderProps {
    hasCategories: boolean;
    categories?: Category[];
}

const MAX_CATEGORIES = 8;

export default function BookmarkHeader({
    hasCategories,
    categories = [],
}: BookmarkHeaderProps) {
    const categoryCount = categories.length;
    const reachedCategoryLimit = categoryCount >= MAX_CATEGORIES;
    const [isDeleting, setIsDeleting] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null
    );
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const openDeleteDialog = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            setIsDeleting(true);
            router.delete(route("categories.destroy", categoryToDelete.id), {
                preserveState: true,
                onSuccess: () => {
                    setIsDeleting(false);
                    setIsDeleteDialogOpen(false);
                    setCategoryToDelete(null);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                    <Grid2X2 className="mr-2 h-6 w-6" />
                    Your Bookmarks
                </h3>

                <div className="flex gap-3 items-center">
                    <CategoryDropdown
                        categories={categories}
                        categoryCount={categoryCount}
                        reachedCategoryLimit={reachedCategoryLimit}
                        hasCategories={hasCategories}
                        isDeleting={isDeleting}
                        onDeleteCategory={openDeleteDialog}
                        maxCategories={MAX_CATEGORIES}
                    />

                    <CategoryLimitIndicator
                        categoryCount={categoryCount}
                        maxCategories={MAX_CATEGORIES}
                        reachedCategoryLimit={reachedCategoryLimit}
                    />

                    <AddBookmarkButton hasCategories={hasCategories} />
                </div>
            </div>

            <CategoryDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                categoryToDelete={categoryToDelete}
                onConfirmDelete={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
}
