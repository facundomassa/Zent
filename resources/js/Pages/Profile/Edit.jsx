import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function Edit({ }) {
    const { auth } = usePage().props;
    const avatarInput = useRef(null);

    const { data, setData, patch, errors, processing } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        avatar: null,
        phone: auth?.user?.phone || '',
        bio: auth?.user?.bio || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('bio', data.bio);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        patch(route('profile.update'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                if (avatarInput.current) {
                    avatarInput.current.value = '';
                }
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Perfil" />

            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h1 className="mb-6 text-2xl font-bold">Editar Perfil</h1>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Sección de Avatar */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Foto de perfil
                            </label>
                            <div className="flex items-center gap-4">
                                <img
                                    src={auth.user.avatar || '/images/default-avatar.png'}
                                    className="object-cover w-16 h-16 rounded-full"
                                    alt="Avatar"
                                />
                                <input
                                    type="file"
                                    ref={avatarInput}
                                    onChange={(e) => setData('avatar', e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*"
                                />
                            </div>
                            {errors.avatar && <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>}
                        </div>

                        {/* Información Básica */}
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Biografía
                                </label>
                                <textarea
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    className="w-full h-32 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Botón de Guardar */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>

                    {/* Sección de Cambio de Contraseña */}
                    <div className="pt-8 mt-12 border-t border-gray-200">
                        <h2 className="mb-6 text-xl font-semibold">Cambiar Contraseña</h2>
                        {/* <form onSubmit={handlePasswordChange}> */}
                            {/* ... Campos para contraseña actual, nueva y confirmación ... */}
                        {/* </form> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}