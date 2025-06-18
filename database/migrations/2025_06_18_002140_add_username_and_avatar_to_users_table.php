<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if columns don't exist before adding them
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->nullable()->after('name');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('email');
            }
        });

        // Update existing users with generated usernames
        $this->generateUsernamesForExistingUsers();

        // Add the unique constraint and make username non-nullable
        Schema::table('users', function (Blueprint $table) {
            // Only modify if the column doesn't already have the constraints
            if (!$this->hasUniqueConstraint('users', 'username')) {
                $table->string('username')->nullable(false)->change();
                $table->unique('username');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if ($this->hasUniqueConstraint('users', 'username')) {
                $table->dropUnique(['username']);
            }
            if (Schema::hasColumn('users', 'username')) {
                $table->dropColumn('username');
            }
            if (Schema::hasColumn('users', 'avatar')) {
                $table->dropColumn('avatar');
            }
        });
    }

    /**
     * Check if a unique constraint exists on a column.
     */
    private function hasUniqueConstraint(string $table, string $column): bool
    {
        $indexes = DB::select("SHOW INDEX FROM {$table} WHERE Column_name = '{$column}' AND Non_unique = 0");
        return !empty($indexes);
    }

    /**
     * Generate usernames for existing users.
     */
    private function generateUsernamesForExistingUsers(): void
    {
        $users = DB::table('users')->whereNull('username')->orWhere('username', '')->get();

        foreach ($users as $user) {
            $baseUsername = $this->generateUsernameFromName($user->name);
            $username = $this->ensureUniqueUsername($baseUsername, $user->id);

            DB::table('users')
                ->where('id', $user->id)
                ->update(['username' => $username]);
        }
    }

    /**
     * Generate a username from a name.
     */
    private function generateUsernameFromName(string $name): string
    {
        // Convert to lowercase and remove special characters
        $username = strtolower(trim($name));
        $username = preg_replace('/[^a-z0-9_]/', '_', $username);
        $username = preg_replace('/_+/', '_', $username); // Replace multiple underscores with single
        $username = trim($username, '_'); // Remove leading/trailing underscores

        if (strlen($username) < 3) {
            $username = $username . '_user';
        }

        if (strlen($username) > 20) {
            $username = substr($username, 0, 20);
        }

        return $username;
    }

    /**
     * Ensure the username is unique.
     */
    private function ensureUniqueUsername(string $baseUsername, int $userId): string
    {
        $username = $baseUsername;
        $counter = 1;

        while (DB::table('users')
            ->where('username', $username)
            ->where('id', '!=', $userId)
            ->exists()
        ) {
            $username = $baseUsername . '_' . $counter;
            $counter++;
        }

        return $username;
    }
};