<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller {
    // Crear un proyecto
    public function store(Request $request) {
        $request->validate(['name' => 'required|string|max:255']);

        Project::create([
            'name' => $request->name,
            'team_id' => auth()->user()->team_id,
        ]);

        return redirect()->back();
    }

    // Eliminar un proyecto
    public function destroy(Project $project) {
        $project->delete();
        return redirect()->back();
    }
}