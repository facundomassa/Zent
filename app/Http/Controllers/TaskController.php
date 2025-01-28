<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller {
    // Actualizar orden de tareas (drag-and-drop)
    public function updateOrder(Request $request) {
        foreach ($request->tasks as $task) {
            Task::find($task['id'])->update(['order' => $task['order']]);
        }
        return response()->json(['success' => true]);
    }

    // Asignar tarea a un usuario
    public function assignUser(Request $request, Task $task) {
        $task->users()->attach($request->user_id);
        return redirect()->back();
    }
}