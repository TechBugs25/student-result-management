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
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('can:manage-system')->group(function () {
        Route::resource('users', App\Http\Controllers\UserController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('classes', AcademicClassController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('students', StudentController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('subjects', App\Http\Controllers\SubjectController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('exams', App\Http\Controllers\ExamController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('grading-scales', App\Http\Controllers\GradingScaleController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });

    Route::resource('results', App\Http\Controllers\ResultController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});
