<?php

namespace App\Repositories;

use App\Models\Bookmark;

class BookmarkRepository
{
    public function getUserBookmarks(int $userId, array $filters = [], int $perPage = 10)
    {
        $query = Bookmark::where('user_id', $userId);

        // Apply category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Apply archive filter
        if (isset($filters['archived'])) {
            $isArchived = filter_var($filters['archived'], FILTER_VALIDATE_BOOLEAN);
            $query->where('is_archived', $isArchived);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%")
                    ->orWhere('url', 'like', "%{$searchTerm}%");
            });
        }

        return $query->with('category')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }
}
