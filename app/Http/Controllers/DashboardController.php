<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Obtener proyectos del equipo del usuario
        $projects = $user->team->projects()->with('tasks')->latest()->get();

        // Obtener tareas asignadas al usuario
        $assignedTasks = $user->tasks()
            ->with('project')
            ->where('status', '!=', 'completada')
            ->orderBy('due_date')
            ->get();
        // dd($user);
        return Inertia::render('Dashboard/Index', [
            'projects' => $projects,
            'assignedTasks' => $assignedTasks,
        ]);
    }
}