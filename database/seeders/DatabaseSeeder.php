<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a single Admin User
        User::create([
            'name' => 'Admin',
            'email' => 'admin@srms.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2. Call the Grading Scale seeder
        $this->call(GradingScaleSeeder::class);
    }
}
