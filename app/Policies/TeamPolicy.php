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
}
