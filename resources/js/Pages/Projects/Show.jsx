import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function ProjectShow() {
    const { project, team, auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_date: '',
        assignees: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tasks.store', project.id), {
            preserveScroll: true,
            onSuccess: () => setData({ title: '', description: '', due_date: '', assignees: [] })
        });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        
        // Lógica para actualizar el orden en backend
        const reorderedTasks = Array.from(project.tasks);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);

        // Actualizar orden en base de datos
        axios.post(route('tasks.reorder', project.id), {
            tasks: reorderedTasks.map((task, index) => ({
                id: task.id,
                order: index + 1
            }))
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={project.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">{project.name}</h1>
                            <p className="mt-2 text-gray-600">{project.description}</p>
                        </div>
                        <Link
                            href={route('team.projects.index', team.id)}
                            as="button"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Volver a proyectos
                        </Link>
                    </div>

                    {/* Formulario de nueva tarea */}
                    <form onSubmit={handleSubmit} className="p-6 mb-8 bg-white rounded-lg shadow">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Título de la tarea"
                                    className="w-full border-gray-300 rounded"
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Descripcion"
                                    className="w-full border-gray-300 rounded"
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full border-gray-300 rounded"
                                />
                            </div>

                            <div>
                                <select
                                    multiple
                                    value={data.assignees}
                                    onChange={(e) => setData('assignees', Array.from(e.target.selectedOptions, option => option.value))}
                                    className="w-full h-10 border-gray-300 rounded"
                                >
                                    {team.users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                Crear Tarea
                            </button>
                        </div>
                    </form>

                    {/* Listado de tareas con drag-and-drop */}
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="tasks">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-4"
                                >
                                    {project.tasks.map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span
                                                                    {...provided.dragHandleProps}
                                                                    className="text-gray-400 cursor-move hover:text-gray-600"
                                                                >
                                                                    ☰
                                                                </span>
                                                                <h3 className="font-medium">{task.title}</h3>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                {task.due_date && (
                                                                    <span>
                                                                        📅 {new Date(task.due_date).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                                
                                                                <div className="flex items-center gap-1">
                                                                    👥 {task.users.map(user => user.name).join(', ')}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 ml-4">
                                                            <Link
                                                                method="delete"
                                                                href={route('tasks.destroy', [project.id, task.id])}
                                                                as="button"
                                                                className="text-red-500 hover:text-red-700"
                                                                onBefore={() => confirm('¿Eliminar esta tarea?')}
                                                            >
                                                                Eliminar
                                                            </Link>
                                                        </div>
                                                    </div>
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
            </div>
        </AuthenticatedLayout>
    );
}