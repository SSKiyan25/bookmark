import { Link, router } from "@inertiajs/react";
import { Category } from "@/types";
import { useState } from "react";

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

    const handleDeleteCategory = (category: Category, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent the Link from activating
        e.stopPropagation(); // Prevent the dropdown from closing

        if (isDeleting) return; // Prevent multiple clicks

        const confirmDelete = window.confirm(
            `Are you sure you want to delete the category "${category.name}"? This will also remove the category from all associated bookmarks.`
        );

        if (confirmDelete) {
            setIsDeleting(true);

            router.delete(route("categories.destroy", category.id), {
                onSuccess: () => {
                    setIsDeleting(false);
                    // The dropdown will close automatically because the page will refresh
                },
                onError: () => {
                    setIsDeleting(false);
                    alert("Failed to delete category. Please try again.");
                },
            });
        }
    };

    return (
        <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
                Your Bookmarks
            </h3>
            <div className="flex gap-2 items-center">
                {/* Category Management */}
                <div className="relative inline-block text-left">
                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            id="category-menu-button"
                            aria-expanded="true"
                            aria-haspopup="true"
                            onClick={() =>
                                document
                                    .getElementById("category-dropdown")
                                    ?.classList.toggle("hidden")
                            }
                            disabled={isDeleting}
                        >
                            Categories
                            <svg
                                className="-mr-1 ml-2 h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        id="category-dropdown"
                        className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    >
                        <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="category-menu-button"
                        >
                            {reachedCategoryLimit ? (
                                <div className="px-4 py-2 text-sm text-amber-600">
                                    Category limit reached (max {MAX_CATEGORIES}
                                    )
                                </div>
                            ) : (
                                <Link
                                    href={route("categories.create")}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Add New Category
                                </Link>
                            )}

                            {hasCategories && categories.length > 0 && (
                                <>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <div className="px-4 py-2 text-xs text-gray-500">
                                        Edit Categories ({categoryCount}/
                                        {MAX_CATEGORIES})
                                    </div>
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                                                    onClick={(e) =>
                                                        handleDeleteCategory(
                                                            category,
                                                            e
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 focus:outline-none"
                                                    disabled={isDeleting}
                                                    title="Delete category"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category limit indicator (visible when near limit) */}
                {categoryCount > 0 &&
                    categoryCount >= MAX_CATEGORIES - 2 &&
                    !reachedCategoryLimit && (
                        <span className="text-xs text-amber-600">
                            {MAX_CATEGORIES - categoryCount}{" "}
                            {MAX_CATEGORIES - categoryCount === 1
                                ? "category"
                                : "categories"}{" "}
                            remaining
                        </span>
                    )}

                {/* Bookmark button */}
                <Link
                    href={route("bookmarks.create")}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        !hasCategories
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    }`}
                    {...(!hasCategories
                        ? {
                              "aria-disabled": true,
                              onClick: (e) => e.preventDefault(),
                          }
                        : {})}
                >
                    Add Bookmark
                </Link>
            </div>
        </div>
    );
}
