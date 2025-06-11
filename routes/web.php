<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BookmarkController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Category routes
    Route::resource('categories', CategoryController::class)->except(['index','show']);
    Route::get('/api/categories', [CategoryController::class, 'getCategories'])->name('api.categories');

    // Bookmark routes
    Route::resource('bookmarks', BookmarkController::class)->except(['index']);
    Route::patch('/bookmarks/{bookmark}/archive', [BookmarkController::class, 'toggleArchive'])->name('bookmarks.archive');
    // API routes for bookmarks
    Route::get('/api/bookmarks', [BookmarkController::class, 'getBookmarks'])
        ->name('api.bookmarks');
    Route::get('/api/bookmarks/category/{category}', [BookmarkController::class, 'getBookmarksByCategory'])
        ->name('api.bookmarks.category');
    Route::get('/api/bookmarks/archived', [BookmarkController::class, 'getArchivedBookmarks'])
        ->name('api.bookmarks.archived');
});

require __DIR__.'/auth.php';