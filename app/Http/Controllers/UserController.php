<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('manage-system');

        $query = User::query();

        // If teacher, only see students
        if ($request->user()->role === 'teacher') {
            $query->where('role', 'student');
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $unlinkedStudents = \App\Models\Student::whereNull('user_id')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'admission_number']);

        return Inertia::render('users/index', [
            'users'            => $users,
            'unlinkedStudents' => $unlinkedStudents,
            'filters'          => ['search' => $search],
            'auth_role'        => $request->user()->role,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-system');

        $allowedRoles = $request->user()->role === 'admin' ? ['admin', 'teacher', 'student'] : ['student'];

        $validated = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'   => ['required', 'string', 'min:8'],
            'role'       => ['required', Rule::in($allowedRoles)],
            'student_id' => ['nullable', 'uuid', 'exists:students,id'],
        ]);

        $studentId = $validated['student_id'] ?? null;
        unset($validated['student_id']);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        if ($user->role === 'student' && $studentId) {
            \App\Models\Student::where('id', $studentId)->update(['user_id' => $user->id]);
        }

        return back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('manage-system');

        if ($request->user()->role === 'teacher' && $user->role !== 'student') {
            abort(403);
        }

        $allowedRoles = $request->user()->role === 'admin' ? ['admin', 'teacher', 'student'] : ['student'];

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role'     => ['required', Rule::in($allowedRoles)],
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        Gate::authorize('manage-system');

        if ($request->user()->role === 'teacher' && $user->role !== 'student') {
            abort(403);
        }

        if ($request->user()->id === $user->id) {
            return back()->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
