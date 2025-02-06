import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Fragment , useEffect } from 'react';

export default function CreateProjectModal({ team, isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: ''
    });

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('team.projects.store', team.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
            preserveScroll: true
        });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel 
                                className="w-full max-w-md p-6 transform bg-white shadow-xl rounded-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Botón de cierre controlado */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <Dialog.Title className="mb-4 text-lg font-bold">
                                        Nuevo Proyecto
                                    </Dialog.Title>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Nombre del Proyecto *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Descripción
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            as="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            as="button"
                                            disabled={processing}
                                            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {processing ? 'Creando...' : 'Crear Proyecto'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}