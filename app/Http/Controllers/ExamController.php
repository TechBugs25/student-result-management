<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $query = Exam::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('academic_year', 'like', "%{$search}%");
            });
        }

        $exams = $query->orderByDesc('start_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('exams/index', [
            'exams'   => $exams,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'academic_year' => ['required', 'string', 'max:50'],
            'start_date'    => ['required', 'date'],
            'end_date'      => ['required', 'date', 'after_or_equal:start_date'],
        ], [
            'name.required'          => 'Exam name is required.',
            'academic_year.required' => 'Academic year is required.',
            'start_date.required'    => 'Start date is required.',
            'end_date.required'      => 'End date is required.',
            'end_date.after_or_equal'=> 'End date must be after or equal to the start date.',
        ]);

        Exam::create($validated);

        return back()->with('success', 'Exam created successfully.');
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'academic_year' => ['required', 'string', 'max:50'],
            'start_date'    => ['required', 'date'],
            'end_date'      => ['required', 'date', 'after_or_equal:start_date'],
        ], [
            'name.required'          => 'Exam name is required.',
            'academic_year.required' => 'Academic year is required.',
            'start_date.required'    => 'Start date is required.',
            'end_date.required'      => 'End date is required.',
            'end_date.after_or_equal'=> 'End date must be after or equal to the start date.',
        ]);

        $exam->update($validated);

        return back()->with('success', 'Exam updated successfully.');
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();

        return back()->with('success', 'Exam deleted successfully.');
    }
}
