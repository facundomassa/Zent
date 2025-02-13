import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { useEffect, useState } from 'react';

export default function EditProfile() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone,
        bio: auth.user.bio,
        avatar: null,
        _method: "PUT",
    });

    const [avatarPreview, setAvatarPreview] = useState(auth.user.avatar);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('avatar');
                setAvatarPreview(auth.user.avatar); // Actualizar preview con nueva imagen
            },
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
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
                            <Label htmlFor="avatar" value="Foto de Perfil" />
                            <div className="flex items-center gap-4 mt-2">
                                <img 
                                    src={data.avatar ? URL.createObjectURL(data.avatar) : 'storage/'+(auth.user.avatar)} 
                                    className="object-cover w-16 h-16 border-2 border-gray-200 rounded-full"
                                    alt="Avatar"
                                />
                                <input
                                    id="avatar"
                                    type="file"
                                    onChange={handleAvatarChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*"
                                />
                            </div>
                            {errors.avatar && <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>}
                        </div>

                        {/* Campos del Formulario */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Nombre */}
                            <div>
                                <Label htmlFor="name" value="Nombre" />
                                <input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="block w-full mt-1"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email" value="Correo Electrónico" />
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="block w-full mt-1"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <Label htmlFor="phone" value="Teléfono" />
                                <input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="block w-full mt-1"
                                />
                            </div>
                        </div>

                        {/* Biografía */}
                        <div className="mt-6">
                            <Label htmlFor="bio" value="Biografía" />
                            <textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>

                        {/* Botón de Guardar */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'} 
                                {processing && (
                                    <span className="ml-2">
                                        <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}