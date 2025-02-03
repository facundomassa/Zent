<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Team;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    // Listar proyectos del equipo
    public function index(Team $team)
    {
        // Verificar que el usuario pertenezca al equipo
        if (!Gate::allows('access-team', $team)) {
            abort(403, 'No tienes acceso a este equipo');
        }

        return Inertia::render('Projects/Index', [
            'team' => $team->load('projects'), // Carga los proyectos del equipo
            'projects' => $team->projects()->latest()->get()
        ]);
    }

    // Crear nuevo proyecto
    public function store(Request $request, Team $team)
    {
        // Validar permisos y datos
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        if (!$team->users->contains(auth()->id())) {
            abort(403, 'Acción no autorizada');
        }

        $project = $team->projects()->create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => auth()->id()
        ]);

        return redirect()->route('team.projects.index', $team)
            ->with('success', 'Proyecto creado exitosamente');
    }

    // Eliminar proyecto
    public function destroy(Team $team, Project $project)
    {
        if ($project->team_id !== $team->id || !$team->isAdmin(auth()->user())) {
            abort(403, 'No tienes permiso para eliminar este proyecto');
        }

        $project->delete();
        return redirect()->back()->with('success', 'Proyecto eliminado');
    }

    // Ver un proyecto
    public function show(Project $project)
    {
        // Verificar que el usuario tiene acceso al equipo del proyecto
        $team = $project->team;
        if (!Gate::allows('access-team', $team)) {
            abort(403, 'Acceso no autorizado');
        }

        return Inertia::render('Projects/Show', [
            'project' => $project->load(['tasks' => function($query) {
                $query->orderBy('order')->with('users');
            }]),
            'team' => $team,
            'users' => $team->users
        ]);
    }
}