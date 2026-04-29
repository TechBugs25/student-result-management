<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function store(Request $request)
    {
        // ✅ Custom validation messages
        $credentials = $request->validate(
            [
                'email' => ['required', 'email'],
                'password' => ['required', 'min:6'],
            ],
            [
                'email.required' => 'Please enter your email address.',
                'email.email' => 'Enter a valid email address (e.g. user@example.com).',
                'password.required' => 'Password cannot be empty.',
                'password.min' => 'Password must be at least 6 characters.',
            ]
        );

        // ✅ Attempt login
        if (! Auth::attempt($credentials, $request->boolean('remember'))) {

            // 🔐 Clean + user-friendly + secure message
            throw ValidationException::withMessages([
                'auth' => 'We couldn’t sign you in with those credentials. Please check your email and password and try again.',
            ]);
        }

        // ✅ Prevent session fixation
        $request->session()->regenerate();

        // ✅ Success message (optional flash)
        return redirect()
            ->intended('dashboard')
            ->with('success', 'Welcome back! You are now signed in.');
    }

    /**
     * Log the user out of the application.
     */
    public function destroy(Request $request)
    {
        Auth::logout();

        // ✅ Invalidate session securely
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')
            ->with('success', 'You have been logged out successfully.');
    }
}
