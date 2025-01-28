import React from 'react';
import { Link } from '@inertiajs/react';
import NavBar from '../Components/NavBar';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <main className="py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}