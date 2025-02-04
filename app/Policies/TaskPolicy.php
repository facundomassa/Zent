<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Task;

class TaskPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function view(User $user, Task $task)
    {
        return $task->project->team->users->contains($user->id);
    }

    public function createComment(User $user, Task $task)
    {
        // Verificar que el usuario pertenezca al equipo del proyecto
        return $task->project->team->users->contains($user->id);
    }
}
