import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ProjectIndex({ team, projects }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title={`Proyectos - ${team.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">Proyectos de {team.name}</h1>
                            <p className="mt-2 text-gray-600">
                                {projects.length} proyectos en total
                            </p>
                        </div>
                        <Link
                            href={route('team.projects.store', team.id)}
                            method="post"
                            as="button"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            data={{ name: 'Nuevo Proyecto' }} // Datos iniciales para el modal
                        >
                            Nuevo Proyecto
                        </Link>
                    </div>

                    {/* Lista de Proyectos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                            >
                                <Link
                                    href={route('projects.show', project.id)}
                                    className="block"
                                >
                                    <h3 className="text-lg font-semibold mb-2">
                                        {project.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {project.description || 'Sin descripción'}
                                    </p>
                                </Link>

                                {/* Solo el admin puede eliminar */}
                                {team.is_admin && (
                                    <div className="mt-4 flex justify-end">
                                        <Link
                                            href={route('team.projects.destroy', {
                                                team: team.id,
                                                project: project.id
                                            })}
                                            method="delete"
                                            className="text-red-500 hover:text-red-700 text-sm"
                                            onBefore={() => confirm('¿Seguro que quieres eliminar este proyecto?')}
                                        >
                                            Eliminar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}