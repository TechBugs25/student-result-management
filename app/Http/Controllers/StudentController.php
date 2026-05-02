<?php

namespace App\Http\Controllers;

use App\Models\AcademicClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with('academicClass');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('admission_number', 'like', "%{$search}%")
                  ->orWhereHas('academicClass', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('section', 'like', "%{$search}%");
                  });
            });
        }

        $students = $query->orderBy('first_name')
            ->orderBy('last_name')
            ->paginate(10)
            ->withQueryString();

        $classes = AcademicClass::orderBy('name')->orderBy('section')->get();

        return Inertia::render('students/index', [
            'students' => $students,
            'classes'  => $classes,
            'filters'  => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'first_name'        => ['required', 'string', 'max:100'],
                'last_name'         => ['required', 'string', 'max:100'],
                'admission_number'  => ['required', 'string', 'max:50', 'unique:students,admission_number'],
                'academic_class_id' => ['required', 'uuid', 'exists:academic_classes,id'],
                'date_of_birth'     => ['required', 'date', 'before:today'],
                'gender'            => ['required', 'in:male,female'],
            ],
            [
                'first_name.required'        => 'First name is required.',
                'last_name.required'         => 'Last name is required.',
                'admission_number.required'  => 'Admission number is required.',
                'admission_number.unique'    => 'This admission number is already taken.',
                'academic_class_id.required' => 'Please select a class.',
                'academic_class_id.exists'   => 'The selected class does not exist.',
                'date_of_birth.required'     => 'Date of birth is required.',
                'date_of_birth.before'       => 'Date of birth must be in the past.',
                'gender.required'            => 'Please select a gender.',
            ]
        );

        Student::create($validated);

        return back()->with('success', 'Student added successfully.');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate(
            [
                'first_name'        => ['required', 'string', 'max:100'],
                'last_name'         => ['required', 'string', 'max:100'],
                'admission_number'  => ['required', 'string', 'max:50', Rule::unique('students', 'admission_number')->ignore($student->id)],
                'academic_class_id' => ['required', 'uuid', 'exists:academic_classes,id'],
                'date_of_birth'     => ['required', 'date', 'before:today'],
                'gender'            => ['required', 'in:male,female'],
            ],
            [
                'first_name.required'        => 'First name is required.',
                'last_name.required'         => 'Last name is required.',
                'admission_number.required'  => 'Admission number is required.',
                'admission_number.unique'    => 'This admission number is already taken.',
                'academic_class_id.required' => 'Please select a class.',
                'academic_class_id.exists'   => 'The selected class does not exist.',
                'date_of_birth.required'     => 'Date of birth is required.',
                'date_of_birth.before'       => 'Date of birth must be in the past.',
                'gender.required'            => 'Please select a gender.',
            ]
        );

        $student->update($validated);

        return back()->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return back()->with('success', 'Student deleted successfully.');
    }
}
