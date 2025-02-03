<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\DashboardController;
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

// Rutas de autenticación (generadas por Breeze)
require __DIR__.'/auth.php';


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rutas autenticadas
Route::middleware(['auth', 'verified'])->group(function () {
    
    //Dashboard principal
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Redirect root to dashboard
    Route::redirect('/', '/dashboard');

    // Equipos
    Route::prefix('teams')->group(function () {
        Route::get('/', [TeamController::class, 'index'])->name('teams.index');
        Route::post('/', [TeamController::class, 'store'])->name('teams.store');
        Route::get('/{team}', [TeamController::class, 'show'])->name('teams.show');
    });

    // Proyectos (dentro de un equipo)
    Route::prefix('teams/{team}/projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('team.projects.index');
        Route::post('/', [ProjectController::class, 'store'])->name('team.projects.store');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('team.projects.destroy');
        Route::put('/{project}', [ProjectController::class, 'update'])->name('team.projects.update');
    });

    // Tareas (dentro de un proyecto)
    Route::prefix('projects/{project}')->group(function () {
        Route::get('/', [ProjectController::class, 'show'])->name('projects.show');
        
        // Rutas para tareas
        Route::prefix('tasks')->group(function () {
            Route::post('/', [TaskController::class, 'store'])->name('tasks.store');
            Route::put('/{task}', [TaskController::class, 'update'])->name('tasks.update');
            Route::delete('/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
            Route::post('/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
            
            // Comentarios
            Route::prefix('{task}/comments')->group(function () {
                Route::post('/', [CommentController::class, 'store'])->name('comments.store');
            });
        });
    });

    // Suscripciones
    Route::prefix('subscriptions')->group(function () {
        Route::get('/', [SubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('subscriptions.checkout');
        Route::get('/success', [SubscriptionController::class, 'success'])->name('subscriptions.success');
        Route::get('/cancel', [SubscriptionController::class, 'cancel'])->name('subscriptions.cancel');
    });

    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});