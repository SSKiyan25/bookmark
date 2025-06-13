interface CategoryLimitIndicatorProps {
    categoryCount: number;
    maxCategories: number;
    reachedCategoryLimit: boolean;
}

export default function CategoryLimitIndicator({
    categoryCount,
    maxCategories,
    reachedCategoryLimit,
}: CategoryLimitIndicatorProps) {
    if (
        categoryCount === 0 ||
        categoryCount < maxCategories - 2 ||
        reachedCategoryLimit
    ) {
        return null;
    }

    const remaining = maxCategories - categoryCount;

    return (
        <span className="text-xs text-destructive/80 hidden sm:inline-block">
            {remaining} {remaining === 1 ? "category" : "categories"} remaining
        </span>
    );
}
