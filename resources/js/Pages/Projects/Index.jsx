import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import EditProjectModal from '@/Components/EditProjectModal';
import CreateProjectModal from '@/Components/CreateProjectModal';

export default function ProjectIndex({ team, projects }) {
    const { auth } = usePage().props;
    const [editingProject, setEditingProject] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title={`Proyectos - ${team.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">Proyectos de {team.name}</h1>
                            <p className="mt-2 text-gray-600">
                                {projects.length} proyectos en total
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                            Nuevo Proyecto
                        </button>
                    </div>

                    {/* Lista de Proyectos */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
                            >
                                <Link
                                    href={route('projects.show', project.id)}
                                    className="block"
                                >
                                    <h3 className="mb-2 text-lg font-semibold">
                                        {project.name}
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-600">
                                        {project.description || 'Sin descripción'}
                                    </p>
                                </Link>

                                {/* Solo el admin puede eliminar y editar */}
                                {team.user_id === auth.user.id && (
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => {setEditingProject(project)}}
                                            className="text-sm text-blue-500 hover:text-blue-700"
                                        >
                                            Editar
                                        </button>
                                        {editingProject?.id === project.id && (
                                        <EditProjectModal
                                            key={project.id}
                                            team={team}
                                            project={editingProject}
                                            isOpen={!!editingProject}
                                            onClose={() => setEditingProject(null)}
                                        />
                                        )}
                                        <Link
                                            href={route('team.projects.destroy', {
                                                team: team.id,
                                                project: project.id
                                            })}
                                            method="delete"
                                            className="text-sm text-red-500 hover:text-red-700"
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
            <CreateProjectModal
                team={team}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}