import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ProjectIndex({ projects }) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Proyectos</h1>
                <div className="space-y-4">
                    {projects.map((project) => (
                        <Link 
                            key={project.id} 
                            href={`/projects/${project.id}`}
                            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                        >
                            {project.name}
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}