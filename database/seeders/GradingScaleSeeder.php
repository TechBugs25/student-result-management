<?php

namespace Database\Seeders;

use App\Models\GradingScale;
use Illuminate\Database\Seeder;

class GradingScaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $scales = [
            ['letter_grade' => 'A+', 'gpa_point' => 5.00, 'min_percentage' => 80.00, 'max_percentage' => 100.00, 'description' => 'Outstanding'],
            ['letter_grade' => 'A', 'gpa_point' => 4.00, 'min_percentage' => 70.00, 'max_percentage' => 79.99, 'description' => 'Excellent'],
            ['letter_grade' => 'A-', 'gpa_point' => 3.50, 'min_percentage' => 60.00, 'max_percentage' => 69.99, 'description' => 'Very Good'],
            ['letter_grade' => 'B', 'gpa_point' => 3.00, 'min_percentage' => 50.00, 'max_percentage' => 59.99, 'description' => 'Good'],
            ['letter_grade' => 'C', 'gpa_point' => 2.00, 'min_percentage' => 40.00, 'max_percentage' => 49.99, 'description' => 'Satisfactory'],
            ['letter_grade' => 'D', 'gpa_point' => 1.00, 'min_percentage' => 33.00, 'max_percentage' => 39.99, 'description' => 'Pass'],
            ['letter_grade' => 'F', 'gpa_point' => 0.00, 'min_percentage' => 0.00, 'max_percentage' => 32.99, 'description' => 'Fail'],
        ];

        foreach ($scales as $scale) {
            GradingScale::create($scale);
        }
    }
}
