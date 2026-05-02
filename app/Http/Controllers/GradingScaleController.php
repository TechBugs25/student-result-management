<?php

namespace App\Http\Controllers;

use App\Models\GradingScale;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GradingScaleController extends Controller
{
    public function index()
    {
        // Fetch all grading scales sorted by GPA descending
        $gradingScales = GradingScale::orderByDesc('gpa_point')->get();

        return Inertia::render('grading-scales/index', [
            'gradingScales' => $gradingScales,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'letter_grade'   => ['required', 'string', 'max:10', 'unique:grading_scales,letter_grade'],
            'gpa_point'      => ['required', 'numeric', 'min:0', 'max:10'],
            'min_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'max_percentage' => ['required', 'numeric', 'min:0', 'max:100', 'gte:min_percentage'],
            'description'    => ['nullable', 'string', 'max:255'],
        ], [
            'letter_grade.unique' => 'This letter grade already exists.',
            'max_percentage.gte'  => 'Max percentage must be greater than or equal to min percentage.',
        ]);

        GradingScale::create($validated);

        return back()->with('success', 'Grading scale created successfully.');
    }

    public function update(Request $request, GradingScale $gradingScale)
    {
        $validated = $request->validate([
            'letter_grade'   => ['required', 'string', 'max:10', Rule::unique('grading_scales')->ignore($gradingScale->id)],
            'gpa_point'      => ['required', 'numeric', 'min:0', 'max:10'],
            'min_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'max_percentage' => ['required', 'numeric', 'min:0', 'max:100', 'gte:min_percentage'],
            'description'    => ['nullable', 'string', 'max:255'],
        ], [
            'letter_grade.unique' => 'This letter grade already exists.',
            'max_percentage.gte'  => 'Max percentage must be greater than or equal to min percentage.',
        ]);

        $gradingScale->update($validated);

        return back()->with('success', 'Grading scale updated successfully.');
    }

    public function destroy(GradingScale $gradingScale)
    {
        $gradingScale->delete();

        return back()->with('success', 'Grading scale deleted successfully.');
    }
}
