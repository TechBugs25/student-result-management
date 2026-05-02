<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $subjects = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('subjects/index', [
            'subjects' => $subjects,
            'filters'  => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:subjects,code'],
            'type' => ['required', 'in:mandatory,optional'],
        ], [
            'name.required' => 'Subject name is required.',
            'code.required' => 'Subject code is required.',
            'code.unique'   => 'This subject code is already in use.',
            'type.required' => 'Please select a subject type.',
        ]);

        Subject::create($validated);

        return back()->with('success', 'Subject added successfully.');
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('subjects', 'code')->ignore($subject->id)],
            'type' => ['required', 'in:mandatory,optional'],
        ], [
            'name.required' => 'Subject name is required.',
            'code.required' => 'Subject code is required.',
            'code.unique'   => 'This subject code is already in use.',
            'type.required' => 'Please select a subject type.',
        ]);

        $subject->update($validated);

        return back()->with('success', 'Subject updated successfully.');
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();

        return back()->with('success', 'Subject deleted successfully.');
    }
}
