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
        $user_id = Auth::id();
        // Get categories for the sidebar/filter
        $categories = Category::where('user_id', Auth::id())
            ->withCount('bookmarks')
            ->orderBy('name')
            ->get();

        // Get filtered bookmarks
        $filters = [
            'category_id' => $request->query('category'),
            'archived' => $request->query('archived'),
            'search' => $request->query('search'),
        ];

        $bookmarks = $this->bookmarkRepository->getUserBookmarks(Auth::id(), $filters);

        return Inertia::render('Dashboard', [
            'categories' => CategoryResource::collection($categories),
            'bookmarks' => BookmarkResource::collection($bookmarks),
            'filters' => $filters
        ]);
    }
}
