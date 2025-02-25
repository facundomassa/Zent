<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller {
    // Mostrar todos los equipos del usuario
    public function index() {
        $teams = Auth::user()->teams()
        ->withCount(['members', 'projects'])
        ->get();

        return inertia('Teams/Index', [
            'teams' => $teams
        ]);
    }

    // Crear un nuevo equipo
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $team = Team::create([
            'name' => $request->name,
            'owner_id' => auth()->id()
        ]);

        $team->members()->attach(auth()->id(), ['role' => 'owner']);

        return redirect()->route('teams.show', $team)
            ->with('success', 'Equipo creado exitosamente');
    }

    public function updateRole(Request $request, Team $team, User $user)
    {
        $this->authorize('manage', $team);

        $request->validate([
            'role' => 'required|in:admin,member'
        ]);

        $team->members()->updateExistingPivot($user->id, [
            'role' => $request->role
        ]);

        return back()->with('success', 'Rol actualizado');
    }

    public function removeMember(Team $team, User $user)
    {
        $this->authorize('manage', $team);

        $team->members()->detach($user->id);

        return back()->with('success', 'Miembro eliminado');
    }

    // Mostrar un equipo específico
    public function show(Team $team)
    {
        $this->authorize('view', $team);

        return inertia('Teams/Show', [
            'team' => $team->load([
                'members',
                'invitations' => fn($query) => $query->where('expires_at', '>', now())
            ])
        ]);
    }

    // Transferir propiedad del equipo
    public function transferOwnership(Request $request, Team $team)
    {
        $this->authorize('transfer', $team);

        $request->validate([
            'new_owner_id' => 'required|exists:users,id'
        ]);

        DB::transaction(function () use ($team, $request) {
            // Actualizar owner
            $team->update(['owner_id' => $request->new_owner_id]);
            
            // Actualizar roles
            $team->members()->updateExistingPivot(auth()->id(), ['role' => 'admin']);
            $team->members()->updateExistingPivot($request->new_owner_id, ['role' => 'owner']);
        });

        return back()->with('success', 'Propiedad transferida');
    }
}