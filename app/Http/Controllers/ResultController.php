<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\GradingScale;
use App\Models\Result;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $query = Result::with(['student', 'exam', 'subject']);
        $user = $request->user();

        if ($user->role === 'student') {
            $studentProfile = Student::where('user_id', $user->id)->first();
            if ($studentProfile) {
                $query->where('student_id', $studentProfile->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        if ($search = $request->input('search')) {
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('admission_number', 'like', "%{$search}%");
            })->orWhereHas('exam', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('subject', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $results = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('results/index', [
            'results'  => $results,
            'filters'  => ['search' => $search],
            'students' => $user->role !== 'student' ? Student::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'admission_number']) : [],
            'exams'    => $user->role !== 'student' ? Exam::orderByDesc('start_date')->get(['id', 'name']) : [],
            'subjects' => $user->role !== 'student' ? Subject::orderBy('name')->get(['id', 'name', 'code']) : [],
            'auth_role' => $user->role,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-system');

        $validated = $request->validate([
            'student_id'     => ['required', 'uuid', 'exists:students,id'],
            'exam_id'        => ['required', 'uuid', 'exists:exams,id'],
            'subject_id'     => ['required', 'uuid', 'exists:subjects,id', Rule::unique('results')->where(function ($query) use ($request) {
                return $query->where('student_id', $request->student_id)
                             ->where('exam_id', $request->exam_id);
            })],
            'marks_obtained' => ['required', 'numeric', 'min:0'],
            'total_marks'    => ['required', 'numeric', 'min:1', 'gte:marks_obtained'],
            'remarks'        => ['nullable', 'string', 'max:1000'],
        ], [
            'subject_id.unique' => 'A result for this student, exam, and subject already exists.',
            'total_marks.gte'   => 'Total marks must be greater than or equal to marks obtained.',
        ]);

        $percentage = ($validated['marks_obtained'] / $validated['total_marks']) * 100;
        
        $gradingScale = GradingScale::where('min_percentage', '<=', $percentage)
            ->where('max_percentage', '>=', $percentage)
            ->first();

        // Fallback if no grading scale covers this percentage
        $validated['letter_grade'] = $gradingScale ? $gradingScale->letter_grade : 'N/A';
        $validated['gpa_point']    = $gradingScale ? $gradingScale->gpa_point : 0.00;

        Result::create($validated);

        return back()->with('success', 'Result saved successfully.');
    }

    public function update(Request $request, Result $result)
    {
        Gate::authorize('manage-system');

        $validated = $request->validate([
            'student_id'     => ['required', 'uuid', 'exists:students,id'],
            'exam_id'        => ['required', 'uuid', 'exists:exams,id'],
            'subject_id'     => ['required', 'uuid', 'exists:subjects,id', Rule::unique('results')->where(function ($query) use ($request) {
                return $query->where('student_id', $request->student_id)
                             ->where('exam_id', $request->exam_id);
            })->ignore($result->id)],
            'marks_obtained' => ['required', 'numeric', 'min:0'],
            'total_marks'    => ['required', 'numeric', 'min:1', 'gte:marks_obtained'],
            'remarks'        => ['nullable', 'string', 'max:1000'],
        ], [
            'subject_id.unique' => 'A result for this student, exam, and subject already exists.',
            'total_marks.gte'   => 'Total marks must be greater than or equal to marks obtained.',
        ]);

        $percentage = ($validated['marks_obtained'] / $validated['total_marks']) * 100;
        
        $gradingScale = GradingScale::where('min_percentage', '<=', $percentage)
            ->where('max_percentage', '>=', $percentage)
            ->first();

        $validated['letter_grade'] = $gradingScale ? $gradingScale->letter_grade : 'N/A';
        $validated['gpa_point']    = $gradingScale ? $gradingScale->gpa_point : 0.00;

        $result->update($validated);

        return back()->with('success', 'Result updated successfully.');
    }

    public function destroy(Result $result)
    {
        Gate::authorize('manage-system');

        $result->delete();

        return back()->with('success', 'Result deleted successfully.');
    }
}
