<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CommentPolicy
{
    public function __construct()
    {
        //
    }

    public function createComment(User $user, Task $task)
    {
        return $task->project->team->users->contains(auth()->id())
            ? Response::allow()
            : Response::deny('No perteneces a este equipo');
    }

    public function deleteComment(User $user, Comment $comment)
    {
        return $comment->user_id === $user->id
            ? Response::allow()
            : Response::deny('Solo el autor puede eliminar el comentario');
    }
}