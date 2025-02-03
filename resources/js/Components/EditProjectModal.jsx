import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment , useEffect } from 'react';

export default function EditProjectModal({ team, project, isOpen, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        name: '',
        description:  ''
    });

    // Actualizar los datos del formulario cuando cambia el proyecto
    useEffect(() => {
        if (project) {
            setData({
                name: project.name,
                description: project.description || ''
            });
        }
    }, [project]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        put(route('team.projects.update', {
            team: team.id,
            project: project.id
        }), {
            onSuccess: () => onClose(),
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
                        className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
                        // Prevenir propagación de eventos de clic
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
                                <Dialog.Title className="mb-4 text-lg font-bold">
                                    Editar Proyecto
                                </Dialog.Title>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Nombre del Proyecto
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Descripción
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {processing ? 'Guardando...' : 'Guardar Cambios'}
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