<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    public function store(Project $project, Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'assignees' => 'array'
        ]);
        
        $task = DB::transaction(function () use ($project, $request) {
            $task = $project->tasks()->create([
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'order' => $project->tasks()->count() + 1
            ]);

            $task->users()->sync($request->assignees);
            
            return $task;
        });

        return back()->with('success', 'Tarea creada');
    }

    public function destroy(Project $project, Task $task)
    {
        abort_unless($task->project_id === $project->id, 404);
        
        $task->delete();
        return back()->with('success', 'Tarea eliminada');
    }

    public function reorder(Project $project, Request $request)
    {
        $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.order' => 'required|integer'
        ]);
        
        DB::transaction(function () use ($request) {
            collect($request->tasks)->each(function ($taskData) {
                Task::where('id', $taskData['id'])->update(['order' => $taskData['order']]);
            });
        });

        // Devolver las tareas actualizadas con el nuevo orden
        return response()->json([
            'tasks' => Task::where('project_id', $project->id)
                ->orderBy('order')
                ->with('users')
                ->get()
        ]);
    }

    // Ver una tarea
    public function show(Project $project, Task $task)
    {
        // Verificar permisos
        $team = $project->team;
        
        if (!Gate::allows('access-team', $team)) {
            abort(403, 'No tienes acceso a esta tarea');
        }

        // Cargar relaciones necesarias
        $task->load([
            'comments' => function($query) {
                $query->latest()->with('user:id,name');
            },
            'users:id,name',
            'project.team'
        ]);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
            'auth' => [
                'user' => auth()->user()->only('id', 'name', 'email', 'team_id')
            ]
        ]);
    }
}