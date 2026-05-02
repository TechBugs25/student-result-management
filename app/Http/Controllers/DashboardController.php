<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Result;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. KPI Counts
        $kpis = [
            'total_students' => Student::count(),
            'total_exams'    => Exam::count(),
            'total_subjects' => Subject::count(),
            'total_results'  => Result::count(),
        ];

        // 2. Bar Chart Data (Results Distribution by Letter Grade)
        $resultsDistribution = Result::select('letter_grade as name', DB::raw('count(*) as value'))
            ->groupBy('letter_grade')
            ->orderBy('letter_grade')
            ->get();

        // 3. Donut Chart Data (Students by Gender)
        $studentDemographics = Student::select('gender as name', DB::raw('count(*) as value'))
            ->groupBy('gender')
            ->get();

        // 4. Top Performing Students (List Data)
        $topStudents = Result::with('student:id,first_name,last_name,admission_number')
            ->select('student_id', DB::raw('AVG(gpa_point) as avg_gpa'), DB::raw('AVG(marks_obtained/total_marks*100) as avg_percentage'))
            ->groupBy('student_id')
            ->orderByDesc('avg_gpa')
            ->orderByDesc('avg_percentage')
            ->take(5)
            ->get()
            ->map(function ($result) {
                return [
                    'id'               => $result->student_id,
                    'name'             => $result->student ? $result->student->first_name . ' ' . $result->student->last_name : 'Unknown',
                    'admission_number' => $result->student ? $result->student->admission_number : 'N/A',
                    'avg_gpa'          => round($result->avg_gpa, 2),
                    'avg_percentage'   => round($result->avg_percentage, 1) . '%',
                ];
            });

        return Inertia::render('dashboard', [
            'kpis'                => $kpis,
            'resultsDistribution' => $resultsDistribution,
            'studentDemographics' => $studentDemographics,
            'topStudents'         => $topStudents,
        ]);
    }
}
