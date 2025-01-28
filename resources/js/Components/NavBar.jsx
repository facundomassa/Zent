import React from 'react';
import { Link } from '@inertiajs/react';

export default function NavBar() {
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-xl font-bold text-gray-800">
                            Zent
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link href="/logout" method="post" className="text-gray-600 hover:text-gray-800">
                            Cerrar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}