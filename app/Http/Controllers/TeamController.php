<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller {
    // Mostrar todos los equipos del usuario
    public function index() {
        $teams = auth()->user()->teams; // Si un usuario puede tener múltiples equipos
        return Inertia::render('Teams/Index', ['teams' => $teams]);
    }

    // Crear un nuevo equipo
    public function store(Request $request) {
        $request->validate(['name' => 'required|string|max:255']);

        $team = Team::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('teams.show', $team);
    }

    // Mostrar un equipo específico
    public function show(Team $team) {
        return Inertia::render('Teams/Show', [
            'team' => $team->load('projects.tasks'),
        ]);
    }
}