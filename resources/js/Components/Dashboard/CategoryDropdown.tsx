import { Link } from "@inertiajs/react";
import { Category } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { PlusCircle, FolderPlus, ChevronDown, Trash2 } from "lucide-react";

interface CategoryDropdownProps {
    categories: Category[];
    categoryCount: number;
    reachedCategoryLimit: boolean;
    hasCategories: boolean;
    isDeleting: boolean;
    onDeleteCategory: (category: Category) => void;
    maxCategories: number;
}

export default function CategoryDropdown({
    categories,
    categoryCount,
    reachedCategoryLimit,
    hasCategories,
    isDeleting,
    onDeleteCategory,
    maxCategories,
}: CategoryDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isDeleting}
            >
                <FolderPlus className="h-4 w-4" />
                Categories
                <ChevronDown className="h-4 w-4" />
            </Button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-card ring-1 ring-border focus:outline-none z-10 animate-in fade-in-50 slide-in-from-top-5">
                    <div className="py-1 divide-y divide-border" role="menu">
                        {reachedCategoryLimit ? (
                            <div className="px-4 py-3 text-sm text-destructive">
                                Category limit reached (max {maxCategories})
                            </div>
                        ) : (
                            <Link
                                href={route("categories.create")}
                                className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-accent"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add New Category
                            </Link>
                        )}

                        {hasCategories && categories.length > 0 && (
                            <div className="py-1">
                                <div className="px-4 flex flex-col py-2 text-xs font-semibold text-muted-foreground">
                                    <span>
                                        Manage Categories ({categoryCount}/
                                        {maxCategories})
                                    </span>
                                    <span className="text-[10px]">
                                        Click to edit or delete
                                    </span>
                                </div>
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-accent"
                                    >
                                        <Link
                                            href={route(
                                                "categories.edit",
                                                category.id
                                            )}
                                            className="flex-grow truncate pr-2"
                                        >
                                            {category.name}
                                        </Link>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onDeleteCategory(category);
                                                }}
                                                className="text-destructive hover:text-destructive/80 focus:outline-none"
                                                disabled={isDeleting}
                                                title="Delete category"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
