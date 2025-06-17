<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\BookmarkResource;
use App\Repositories\BookmarkRepository;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $bookmarkRepository;

    public function __construct(BookmarkRepository $bookmarkRepository)
    {
        $this->bookmarkRepository = $bookmarkRepository;
    }

    public function index(Request $request)
    {
        // Get categories for the sidebar/filter
        $categories = Category::where('user_id', Auth::id())
            ->withCount('bookmarks')
            ->orderBy('name')
            ->get();

        // Get filtered bookmarks with pagination
        $filters = [
            'category_id' => $request->query('category'),
            'archived' => $request->query('archived'),
            'search' => $request->query('search'),
        ];

        $bookmarks = $this->bookmarkRepository->getUserBookmarks(Auth::id(), $filters, 3);

        // Check if this is a partial reload request (infinite scroll)
        if ($request->header('X-Inertia-Partial-Data') === 'bookmarks') {
            // Return partial Inertia response for infinite scroll
            return Inertia::render('Dashboard', [
                'bookmarks' => [
                    'data' => BookmarkResource::collection($bookmarks->items())->resolve(),
                    'meta' => [
                        'current_page' => $bookmarks->currentPage(),
                        'last_page' => $bookmarks->lastPage(),
                        'per_page' => $bookmarks->perPage(),
                        'total' => $bookmarks->total(),
                        'has_more_pages' => $bookmarks->hasMorePages(),
                    ]
                ]
            ]);
        }

        // Initial page load - return full Inertia response
        return Inertia::render('Dashboard', [
            'categories' => CategoryResource::collection($categories),
            'bookmarks' => [
                'data' => BookmarkResource::collection($bookmarks->items())->resolve(),
                'meta' => [
                    'current_page' => $bookmarks->currentPage(),
                    'last_page' => $bookmarks->lastPage(),
                    'per_page' => $bookmarks->perPage(),
                    'total' => $bookmarks->total(),
                    'has_more_pages' => $bookmarks->hasMorePages(),
                ]
            ],
            'filters' => $filters
        ]);
    }
}
