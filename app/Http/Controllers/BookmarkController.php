<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bookmark;
use App\Models\Category;
use App\Http\Requests\BookmarkRequest;
use App\Http\Resources\BookmarkResource;
use App\Repositories\BookmarkRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    protected $bookmarkRepository;

    public function __construct(BookmarkRepository $bookmarkRepository)
    {
        $this->bookmarkRepository = $bookmarkRepository;
    }

    /**
     * Display a listing of bookmarks (API method)
     */
    public function getBookmarks(Request $request)
    {
        $filters = [
            'category_id' => $request->query('category'),
            'archived' => $request->query('archived'),
            'search' => $request->query('search'),
        ];

        $bookmarks = $this->bookmarkRepository->getUserBookmarks(Auth::id(), $filters);

        return response()->json([
            'bookmarks' => BookmarkResource::collection($bookmarks)
        ]);
    }

    /**
     * Get bookmarks filtered by category (API method)
     */
    public function getBookmarksByCategory(Request $request, Category $category)
    {
        // Check if category belongs to user
        if ($category->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $filters = [
            'category_id' => $category->id,
            'archived' => $request->query('archived'),
            'search' => $request->query('search'),
        ];

        $bookmarks = $this->bookmarkRepository->getUserBookmarks(Auth::id(), $filters);

        return response()->json([
            'bookmarks' => BookmarkResource::collection($bookmarks)
        ]);
    }

    /**
     * Get archived bookmarks (API method)
     */
    public function getArchivedBookmarks(Request $request)
    {
        $filters = [
            'category_id' => $request->query('category'),
            'archived' => true,
            'search' => $request->query('search'),
        ];

        $bookmarks = $this->bookmarkRepository->getUserBookmarks(Auth::id(), $filters);

        return response()->json([
            'bookmarks' => BookmarkResource::collection($bookmarks)
        ]);
    }

    public function create()
    {
        $categories = Category::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return Inertia::render('Bookmark/Create', [
            'categories' => $categories
        ]);
    }

    public function store(BookmarkRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();

            // Check if the category belongs to the user
            $category = Category::findOrFail($data['category_id']);
            if ($category->user_id !== Auth::id()) {
                if ($request->expectsJson()) {
                    return response()->json(['message' => 'Unauthorized category'], 403);
                }
                return redirect()->back()->withErrors(['category_id' => 'Invalid category']);
            }

            $bookmark = Bookmark::create($data);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Bookmark created successfully',
                    'bookmark' => new BookmarkResource($bookmark)
                ], 201);
            }

            return redirect()->route('dashboard')
                ->with('success', 'Bookmark created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating bookmark: ' . $e->getMessage());

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Failed to create bookmark',
                    'error' => 'An error occurred while creating the bookmark'
                ], 500);
            }

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create bookmark: ' . $e->getMessage()]);
        }
    }

    public function edit(Bookmark $bookmark)
    {
        // Check if bookmark belongs to user
        if ($bookmark->user_id !== Auth::id()) {
            abort(403);
        }

        $categories = Category::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return Inertia::render('Bookmark/Edit', [
            'bookmark' => new BookmarkResource($bookmark),
            'categories' => $categories
        ]);
    }

    public function update(BookmarkRequest $request, Bookmark $bookmark)
    {
        // Check if bookmark belongs to user
        if ($bookmark->user_id !== Auth::id()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        try {
            $data = $request->validated();

            // Check if the category belongs to the user
            $category = Category::findOrFail($data['category_id']);
            if ($category->user_id !== Auth::id()) {
                if ($request->expectsJson()) {
                    return response()->json(['message' => 'Unauthorized category'], 403);
                }
                return redirect()->back()->withErrors(['category_id' => 'Invalid category']);
            }

            $bookmark->update($data);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Bookmark updated successfully',
                    'bookmark' => new BookmarkResource($bookmark)
                ]);
            }

            return redirect()->route('dashboard')
                ->with('success', 'Bookmark updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating bookmark: ' . $e->getMessage());

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Failed to update bookmark',
                    'error' => 'An error occurred while updating the bookmark'
                ], 500);
            }

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update bookmark: ' . $e->getMessage()]);
        }
    }

    public function toggleArchive(Request $request, Bookmark $bookmark)
    {
        // Check if bookmark belongs to user
        if ($bookmark->user_id !== Auth::id()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        try {
            $bookmark->is_archived = !$bookmark->is_archived;
            $bookmark->save();

            $status = $bookmark->is_archived ? 'archived' : 'unarchived';

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => "Bookmark {$status} successfully",
                    'bookmark' => new BookmarkResource($bookmark)
                ]);
            }

            return redirect()->back()
                ->with('success', "Bookmark {$status} successfully");
        } catch (\Exception $e) {
            Log::error('Error toggling bookmark archive status: ' . $e->getMessage());

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Failed to update bookmark',
                    'error' => 'An error occurred while updating the bookmark'
                ], 500);
            }

            return redirect()->back()
                ->withErrors(['error' => 'Failed to update bookmark status']);
        }
    }

    public function destroy(Request $request, Bookmark $bookmark)
    {
        // Check if bookmark belongs to user
        if ($bookmark->user_id !== Auth::id()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        try {
            $bookmark->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Bookmark deleted successfully'
                ]);
            }

            return redirect()->route('dashboard')
                ->with('success', 'Bookmark deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting bookmark: ' . $e->getMessage());

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Failed to delete bookmark',
                    'error' => 'An error occurred while deleting the bookmark'
                ], 500);
            }

            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete bookmark']);
        }
    }
}
