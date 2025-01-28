// resources/js/Pages/Test.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function Test() {
    return (
        <div>
            <h1>¡Funciona! 🎉</h1>
            <Link href="/dashboard">Ir al Dashboard</Link>
        </div>
    );
}