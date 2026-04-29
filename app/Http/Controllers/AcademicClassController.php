<?php

namespace App\Http\Controllers;

use App\Models\AcademicClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicClassController extends Controller
{
    public function index()
    {
        $classes = AcademicClass::withCount('students')
            ->orderBy('name')
            ->orderBy('section')
            ->get();

        return Inertia::render('classes/index', [
            'classes' => $classes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:100'],
                'section' => ['required', 'string', 'max:10'],
            ],
            [
                'name.required' => 'Class name is required.',
                'section.required' => 'Section is required.',
            ]
        );

        // Composite unique check (name + section)
        $exists = \App\Models\AcademicClass::where('name', $request->name)
            ->where('section', $request->section)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'section' => 'This class and section combination already exists.',
            ])->withInput();
        }

        AcademicClass::create($validated);

        return back()->with('success', 'Class created successfully.');
    }

    public function update(Request $request, AcademicClass $class)
    {
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:100'],
                'section' => ['required', 'string', 'max:10'],
            ],
            [
                'name.required' => 'Class name is required.',
                'section.required' => 'Section is required.',
            ]
        );

        // Composite unique check (name + section), excluding current record
        $exists = \App\Models\AcademicClass::where('name', $request->name)
            ->where('section', $request->section)
            ->where('id', '!=', $class->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'section' => 'This class and section combination already exists.',
            ])->withInput();
        }

        $class->update($validated);

        return back()->with('success', 'Class updated successfully.');
    }

    public function destroy(AcademicClass $class)
    {
        $class->delete();

        return back()->with('success', 'Class deleted successfully.');
    }
}
