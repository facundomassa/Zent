<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\TeamInvitationMail;
use App\Models\TeamInvitation;
use App\Models\Team;
use app\Models\User;
use Illuminate\Http\Request;

class TeamInvitationController extends Controller
{
    public function invite(Request $request, Team $team)    
    {
        
        $this->authorize('manage', $team);

        $request->validate([
            'email' => 'required|email|max:255|unique:users,email',
        ]);

        // Verificar si ya existe una invitación pendiente
        if ($team->invitations()->where('email', $request->email)->exists()) {
            return back()->with('error', 'Ya existe una invitación pendiente para este email.');
        }

        // Crear la invitación
        $invitation = $team->invitations()->create([
            'email' => $request->email,
            'token' => Str::random(40),
            'expires_at' => now()->addDays(7),
        ]);

        // Generar URL de aceptación
        $acceptUrl = route('team-invitations.accept', $invitation->token);

        Mail::to($request->email)->send(
            new TeamInvitationMail($invitation, $acceptUrl)
        );

        return back()->with('success', 'Invitación enviada');
    }

    public function accept($token)
    {
        
        $invitation = TeamInvitation::where('token', $token)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        // Si el usuario está autenticado
        if (Auth::check()) {
            $user = Auth::user();
            
            if ($user->email !== $invitation->email) {
                return redirect()->route('dashboard')
                    ->with('error', 'El email no coincide con la invitación');
            }

            $this->addToTeam($invitation, $user);
            return redirect()->route('teams.show', $invitation->team);
        }

        // Si el usuario no está registrado
        return redirect()->route('register', [
            'invitation' => $token,
            'email' => $invitation->email
        ]);
    }

    private function addToTeam($invitation, $user)
    {
        $invitation->team->members()->attach($user->id, [
            'role' => $invitation->role
        ]);
        
        $invitation->delete();
    }

    public function destroy(TeamInvitation $invitation)
    {
        $this->authorize('manage', $invitation->team);
        $invitation->delete();
        
        return back()->with('success', 'Invitación cancelada');
    }
}
