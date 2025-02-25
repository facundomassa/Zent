<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TeamInvitation;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request)
    {
        $invitation = $request->get('invitation');
        $email = $request->get('email');

        return Inertia::render('Auth/Register')->with([
            'invitation' => $invitation,
            'email' => $email
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'invitation_token' => 'sometimes|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Procesar invitación si existe
        if ($request->invitation_token) {
            $invitation = TeamInvitation::with('team')
                ->where('token', $request->invitation_token)
                ->where('email', $request->email)
                ->where('expires_at', '>', now())
                ->first();

            if (!$invitation) {
                Auth::login($user);
                return redirect()->route('dashboard')
                    ->with('error', 'Invitación inválida o expirada');
            }

            // Verificar que el usuario no esté ya en el equipo
            if ($invitation->team->members()->where('user_id', $user->id)->exists()) {
                $invitation->delete();
                Auth::login($user);
                return redirect()->route('dashboard')
                    ->with('error', 'Ya eres miembro de este equipo');
            }

            // Añadir al equipo
            $invitation->team->members()->attach($user->id, [
                'role' => $invitation->role
            ]);
            
            $invitation->delete();
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard')
        ->with('success', $invitation ? '¡Bienvenido! Has sido añadido al equipo' : 'Registro exitoso');
    }
}
