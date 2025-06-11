<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function getCategories()
    {
        $categories = Category::where('user_id', Auth::id())
            ->withCount('bookmarks')
            ->orderBy('name')
            ->get();
        return response()->json([
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function create()
    {
        $categoryCount = Auth::user()->categories()->count();
        $maxCategories = 8;

        if ($categoryCount >= $maxCategories) {
            return redirect()->route('dashboard')
                ->with('error', "You've reached the maximum limit of {$maxCategories} categories.");
        }

        return Inertia::render('Category/Create');
    }

    public function store(CategoryRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();

            if (isset($data['category_limit'])) {
                unset($data['category_limit']);
            }

            $newCategory = Category::create($data);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Category created successfully',
                    'category' => new CategoryResource($newCategory)
                ], 201);
            }

            return redirect()->route('dashboard')
                ->with('success', 'Category ' . $newCategory->name . ' created successfully.');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Failed to create category',
                    'errors' => ['error' => 'Failed to create category.']
                ], 500);
            }
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create category.']);
        }
    }

    public function edit(Category $category)
    {
        // Authorize that this category belongs to the user
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Category/Edit', [
            'category' => new CategoryResource($category),
        ]);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        // Authorize that this category belongs to the user
        if ($category->user_id !== Auth::id()) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        try {
            $category->update($request->validated());

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Category updated successfully',
                    'category' => new CategoryResource($category)
                ]);
            }

            return redirect()->route('dashboard')
                ->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating category: ' . $e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Failed to update category',
                    'errors' => ['error' => 'Failed to update category.']
                ], 500);
            }

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update category.']);
        }
    }

    public function destroy(Request $request, Category $category)
    {
        // Authorize that this category belongs to the user
        if ($category->user_id !== Auth::id()) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        try {
            $categoryName = $category->name;

            $category->delete();

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => "Category \"$categoryName\" deleted successfully"
                ]);
            }

            return redirect()->route('dashboard')
                ->with('success', "Category \"$categoryName\" deleted successfully.");
        } catch (\Exception $e) {
            Log::error('Error deleting category: ' . $e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Failed to delete category',
                    'errors' => ['error' => 'Failed to delete category.']
                ], 500);
            }

            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete category.']);
        }
    }
}
