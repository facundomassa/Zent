<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Team;

class TeamPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function accessTeam(User $user, Team $team)
    {
        return $team->users->contains($user->id);
    }

    public function updateProject(User $user, Team $team)
    {
        return $team->isAdmin($user);
    }

    public function manage(User $user, Team $team)
    {
        return $user->id === $team->owner_id || 
            $user->teams()->where('team_id', $team->id)
                ->whereIn('role', ['owner', 'admin'])
                ->exists();
    }

    public function view(User $user, Team $team)
    {
        return $user->id === $team->owner_id || 
            $user->teams()->where('team_id', $team->id)
                ->whereIn('role', ['owner', 'admin', 'member'])
                ->exists();
    }
}
