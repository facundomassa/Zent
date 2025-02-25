import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ invitation, email }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: email || '',
        password: '',
        password_confirmation: '',
        invitation_token: invitation || '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
                <Head title="Registro" />
                
                <div>
                    <h2 className="mt-6 text-3xl font-bold text-center text-gray-900">
                        {invitation ? 'Unirse al equipo' : 'Crear cuenta'}
                    </h2>
                    {invitation && (
                        <p className="mt-2 text-sm text-center text-gray-600">
                            Has sido invitado a unirte a un equipo
                        </p>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <input type="hidden" name="invitation_token" value={data.invitation_token} />

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            required
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            required
                            disabled={!!email}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            required
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            {processing ? 'Registrando...' : 'Registrarme'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <Link 
                            href={route('login')} 
                            className="text-blue-500 hover:text-blue-700"
                        >
                            ¿Ya tienes cuenta? Inicia sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}