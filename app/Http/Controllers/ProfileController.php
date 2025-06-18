<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => Auth::user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = Auth::user();

        // Debug: Log all request data
        Log::info('Profile update request data:', $request->all());
        Log::info('Has avatar file:', ['has_file' => $request->hasFile('avatar')]);

        $validated = $request->validated();

        // Remove avatar from validated data if no file was uploaded
        // Prevents overwriting the existing avatar with null
        if (!$request->hasFile('avatar')) {
            unset($validated['avatar']);
            Log::info('No avatar file uploaded, preserving existing avatar');
        }

        Log::info('Validated data after avatar check:', $validated);

        // Handle avatar upload only if a file was uploaded
        if ($request->hasFile('avatar')) {
            Log::info('Avatar file details:', [
                'original_name' => $request->file('avatar')->getClientOriginalName(),
                'size' => $request->file('avatar')->getSize(),
                'mime_type' => $request->file('avatar')->getMimeType(),
            ]);

            Log::info('Processing avatar upload...');

            // Delete old avatar if it exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
                Log::info('Deleted old avatar: ' . $user->avatar);
            }

            try {
                // Store new avatar
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $validated['avatar'] = $avatarPath;
                Log::info('Avatar stored successfully at: ' . $avatarPath);
            } catch (\Exception $e) {
                Log::error('Avatar storage failed: ' . $e->getMessage());
                return Redirect::route('profile.edit')->with('error', 'Avatar upload failed');
            }
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
        Log::info('User updated successfully');

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = Auth::user();

        // Delete user's avatar if it exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Remove the user's avatar.
     */
    public function removeAvatar(): RedirectResponse
    {
        $user = Auth::user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->update(['avatar' => null]);

        return Redirect::route('profile.edit')->with('status', 'avatar-removed');
    }
}