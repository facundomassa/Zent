<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Models\Project;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Equipos
Route::resource('teams', TeamController::class)->middleware(['auth', 'verified']);

// Proyectos
Route::post('/projects', [ProjectController::class, 'store'])->middleware(['auth', 'verified']);
Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->middleware(['auth', 'verified']);
Route::get('/projects/{project}', function (Project $project) {
    return Inertia::render('Projects/Show', [
        'project' => $project->load('tasks'),
    ]);
})->middleware(['auth', 'verified']);

// Tareas
Route::post('/tasks/update-order', [TaskController::class, 'updateOrder'])->middleware(['auth', 'verified']);
Route::post('/tasks/{task}/assign', [TaskController::class, 'assignUser'])->middleware(['auth', 'verified']);

require __DIR__.'/auth.php';
