import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TeamsIndex({ auth, teams }) {
    return (
        <AuthenticatedLayout>
            <Head title="Mis Equipos" />
            
            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Mis Equipos</h1>
                    <Link 
                        href={route('teams.create')} 
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Nuevo Equipo
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {teams.map(team => (
                        <div key={team.id} className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">{team.name}</h2>
                                {team.owner_id === auth.user.id && (
                                    <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">
                                        Propietario
                                    </span>
                                )}
                            </div>
                            
                            <div className="mb-4 text-gray-600">
                                <p>Miembros: {team.members_count}</p>
                                <p>Proyectos: {team.projects_count}</p>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={route('teams.show', team.id)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Administrar
                                </Link>
                                {team.owner_id === auth.user.id && (
                                    <Link
                                        href={route('teams.edit', team.id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Editar
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}