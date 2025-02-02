import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth, projects, assignedTasks }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Hola, Bienvenido a Zent 🚀</h1>
                        <p className="mt-2 text-gray-600">Tienes {assignedTasks.length} tareas pendientes.</p>
                    </div>

                    {/* Grid de Contenido */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sección de Proyectos */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Tus Proyectos</h2>
                                    <Link
                                        href={route('team.projects.store',{ team: auth.user?.team_id })}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Nuevo Proyecto
                                    </Link>
                                </div>

                                {/* Lista de Proyectos */}
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <Link
                                            key={project.id}
                                            href={route('projects.show', project.id)}
                                            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="font-medium">{project.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {project.tasks.length} tareas
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sección de Tareas Asignadas */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Tus Tareas</h2>
                            
                            <div className="space-y-4">
                                {assignedTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{task.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Proyecto: {task.project.name}
                                                </p>
                                            </div>
                                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {task.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Fecha límite: {task.due_date}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sección de Actividad Reciente (Opcional) */}
                    {/* <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
                        ...
                    </div> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}