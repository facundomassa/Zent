import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function TeamShow({ team }) {
    const { auth } = usePage().props;
    const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
        email: ''
    });

    // Determinar si el usuario actual es admin/owner
    const currentUserRole = team.members.find(m => m.id === auth.user.id)?.pivot.role;
    const isAdmin = ['owner', 'admin'].includes(currentUserRole);

    // Manejar invitaciones
    const handleInvite = (e) => {
        e.preventDefault();
        post(route('teams.invite', team.id), {
            preserveScroll: true,
            onSuccess: () => setData('email', '')
        });
    };
    console.log(team.id);
    // Actualizar rol de miembro
    const updateRole = (userId, newRole) => {
        put(route('teams.update-role', [team.id, userId]), {
            data: { role: newRole },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Administrar ${team.name}`} />
            
            <div className="max-w-4xl py-12 mx-auto sm:px-6 lg:px-8">
                <div className="p-6 mb-8 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">{team.name}</h1>
                        <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                            {team.owner_id === auth.user.id ? 'Propietario' : 'Administrador'}
                        </span>
                    </div>

                    {/* Sección de Invitaciones */}
                    {isAdmin && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-semibold">Invitar Miembros</h2>
                            <form onSubmit={handleInvite} className="flex gap-2">
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email del miembro"
                                    className="flex-1 border-gray-300 rounded"
                                    disabled={processing}
                                />
                                <button 
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? 'Enviando...' : 'Invitar'}
                                </button>
                            </form>
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                    )}

                    {/* Lista de Miembros */}
                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-semibold">Miembros del Equipo</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Nombre</th>
                                        <th className="px-4 py-2 text-left">Email</th>
                                        <th className="px-4 py-2 text-left">Rol</th>
                                        {isAdmin && <th className="px-4 py-2 text-left">Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.members.map(member => (
                                        <tr key={member.id} className="border-t">
                                            <td className="px-4 py-3">{member.name}</td>
                                            <td className="px-4 py-3">{member.email}</td>
                                            <td className="px-4 py-3">
                                                {isAdmin ? (
                                                    <select
                                                        value={member.pivot.role}
                                                        onChange={(e) => updateRole(member.id, e.target.value)}
                                                        className="px-2 py-1 border rounded"
                                                        disabled={member.pivot.role === 'owner'}
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="member">Miembro</option>
                                                    </select>
                                                ) : (
                                                    <span className="capitalize">{member.pivot.role}</span>
                                                )}
                                            </td>
                                            {isAdmin && (
                                                <td className="px-4 py-3">
                                                    {member.pivot.role !== 'owner' && (
                                                        <button
                                                            onClick={() => destroy(route('teams.remove-member', [team.id, member.id]))}
                                                            className="text-sm text-red-600 hover:text-red-900"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Invitaciones Pendientes */}
                    {team.invitations.length > 0 && (
                        <div className="pt-6 border-t">
                            <h2 className="mb-4 text-xl font-semibold">Invitaciones Pendientes</h2>
                            <div className="space-y-2">
                                {team.invitations.map(invitation => (
                                    <div key={invitation.id} className="flex items-center justify-between p-3 rounded bg-gray-50">
                                        <span>{invitation.email}</span>
                                        {isAdmin && (
                                            <button
                                                onClick={() => destroy(route('team-invitations.destroy', invitation.id))}
                                                className="text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                Cancelar invitación
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Volver al listado */}
                <Link 
                    href={route('teams.index')}
                    className="text-blue-500 hover:text-blue-700"
                >
                    ← Volver a mis equipos
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}