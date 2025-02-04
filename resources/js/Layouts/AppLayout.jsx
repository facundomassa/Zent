import React from 'react';
import { Head, Link } from '@inertiajs/react';
import NavBar from '../Components/NavBar';

export default function AppLayout({ children }) {
    return (
        
        <div className="min-h-screen bg-gray-100">
            <Head>
                <meta name="csrf-token" content={window.csrf_token} />
            </Head>
            <NavBar />
            <main className="px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}