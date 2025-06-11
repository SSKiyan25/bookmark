import { BookmarkFilters } from "@/types";
import { Category } from "@/types";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

interface FilterBarProps {
    categories: Category[];
    filters: BookmarkFilters;
    hasActiveFilters: boolean;
    onCategoryChange: (categoryId: string | null) => void;
    onArchivedToggle: () => void;
    onSearch: (e: React.FormEvent) => void;
    onSearchQueryChange: (query: string) => void;
    onClearFilters: () => void;
    searchQuery: string | null; // Needed for controlled input
}

export default function FilterBar({
    categories,
    filters,
    hasActiveFilters,
    onCategoryChange,
    onArchivedToggle,
    onSearch,
    onSearchQueryChange,
    onClearFilters,
    searchQuery,
}: FilterBarProps) {
    return (
        <div className="mb-6 p-4 bg-white shadow-sm sm:rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <CategoryFilter
                    categories={categories}
                    selectedCategory={filters.category_id}
                    onChange={onCategoryChange}
                />

                {/* Archive Toggle */}
                <div className="flex items-center">
                    <button
                        onClick={onArchivedToggle}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            filters.archived
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {filters.archived ? "Show All" : "Show Archived"}
                    </button>
                </div>

                {/* Search Box */}
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchQueryChange={onSearchQueryChange}
                    onSearch={onSearch}
                    placeholder="Search by title, URL or description..."
                    label="Search Bookmarks"
                />

                {/* Clear Filters, will only show if filters are active */}
                {hasActiveFilters && (
                    <div className="ml-auto">
                        <button
                            onClick={onClearFilters}
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
