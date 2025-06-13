import React from "react";
import { Category } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { ChevronDown, FolderIcon } from "lucide-react";

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string | null;
    onChange: (categoryId: string | null) => void;
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onChange,
}: CategoryFilterProps) {
    // Find the selected category name for display
    const selectedCategoryName = selectedCategory
        ? categories.find((cat) => cat.id.toString() === selectedCategory)
              ?.name || "Category"
        : "All Categories";

    return (
        <div className="w-full max-w-xs">
            <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-foreground mb-1.5"
            >
                Filter by Category
            </label>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                        id="category-filter"
                    >
                        <span className="flex items-center gap-2 truncate">
                            <FolderIcon className="h-4 w-4" />
                            <span className="truncate">
                                {selectedCategoryName}
                            </span>
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[--radix-dropdown-trigger-width]">
                    <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuRadioGroup
                        value={selectedCategory || ""}
                        onValueChange={(value) => onChange(value || null)}
                    >
                        <DropdownMenuRadioItem value="">
                            All Categories
                        </DropdownMenuRadioItem>

                        {categories.map((category) => (
                            <DropdownMenuRadioItem
                                key={category.id}
                                value={category.id.toString()}
                                className="flex justify-between"
                            >
                                <span className="truncate">
                                    {category.name}
                                </span>
                                {(category.bookmarks_count ?? 0) > 0 && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        {category.bookmarks_count}
                                    </span>
                                )}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
