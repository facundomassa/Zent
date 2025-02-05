<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Broadcast;
use App\Events\NewCommentEvent;

class CommentController extends Controller
{
    public function store(Project $project, Task $task, Request $request)
    {
        
        // Gate::authorize('createComment', $task);

        $request->validate(['content' => 'required|string|max:1000']);

        $comment = $task->comments()->create([
            'content' => $request->content,
            'user_id' => auth()->id()
        ]);

        // Disparar evento para WebSocket
        broadcast(new NewCommentEvent($comment))->toOthers();

        return back()->with('success', 'Comentario agregado');
    }

    public function destroy(Project $project, Task $task, Comment $comment)
    {
        Gate::authorize('deleteComment', $comment);
        
        $comment->delete();

        // Disparar evento para WebSocket
        broadcast(new CommentDeletedEvent($comment->id))->toOthers();

        return back()->with('success', 'Comentario eliminado');
    }
}