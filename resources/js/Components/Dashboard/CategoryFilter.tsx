import { Category } from "@/types";

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
    return (
        <div>
            <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-foreground"
            >
                Filter by Category
            </label>
            <select
                id="category-filter"
                value={selectedCategory || ""}
                onChange={(e) => onChange(e.target.value || null)}
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
                <option value="">All Categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                        {category.name} ({category.bookmarks_count || 0})
                    </option>
                ))}
            </select>
        </div>
    );
}
