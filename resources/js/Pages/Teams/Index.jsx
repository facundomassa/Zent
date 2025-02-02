import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function TeamIndex({ teams }) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Mis Equipos</h1>
                <div className="space-y-4">
                    {/* {teams.map((team) => (
                        <Link 
                            key={team.id} 
                            href={`/teams/${team.id}`}
                            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                        >
                            {team.name}
                        </Link>
                    ))} */}
                </div>
            </div>
        </AppLayout>
    );
}