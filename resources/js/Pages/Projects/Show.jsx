import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '../../Layouts/AppLayout';

export default function TaskBoard({ project }) {
    const [tasks, setTasks] = useState(project.tasks);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);

        setTasks(reorderedTasks);

        // Enviar nuevo orden al backend
        Inertia.post('/tasks/update-order', {
            tasks: reorderedTasks.map((task, index) => ({
                id: task.id,
                order: index,
            })),
        });
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">{project.name}</h1>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="tasks">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2"
                            >
                                {tasks.map((task, index) => (
                                    <Draggable 
                                        key={task.id} 
                                        draggableId={String(task.id)} 
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-4 bg-white rounded-lg shadow"
                                            >
                                                {task.title}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </AppLayout>
    );
}