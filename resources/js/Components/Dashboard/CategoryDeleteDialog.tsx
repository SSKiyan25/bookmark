import { Category } from "@/types";
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

interface CategoryDeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    categoryToDelete: Category | null;
    onConfirmDelete: () => void;
    onCancel: () => void;
}

export default function CategoryDeleteDialog({
    isOpen,
    onOpenChange,
    categoryToDelete,
    onConfirmDelete,
    onCancel,
}: CategoryDeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the category "
                        {categoryToDelete?.name}"? This will also remove the
                        category from all associated bookmarks.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
