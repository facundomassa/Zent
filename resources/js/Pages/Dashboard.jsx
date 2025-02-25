import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const { flash } = usePage().props;
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            {flash.success && (
                <div className="px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                    {flash.error}
                </div>
            )}
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
