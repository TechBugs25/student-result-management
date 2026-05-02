<?php

use App\Http\Controllers\AcademicClassController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'login')->name('login');
    Route::post('/login', [AuthController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');

    Route::resource('classes', AcademicClassController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('students', StudentController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});
