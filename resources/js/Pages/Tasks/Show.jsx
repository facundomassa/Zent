import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function TaskShow({ task }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        content: ''
    });

    // Estado local para los comentarios
    const [comments, setComments] = useState(task.comments);

    // Configurar Echo para actualizaciones en tiempo real
    useEffect(() => {
        window.Echo.private(`task.${task.id}`)
            .listen('NewComment', (e) => {
                setComments(prev => [...prev, e.comment]);
            })
            .listen('CommentDeleted', (e) => {
                setComments(prev => prev.filter(c => c.id !== e.commentId));
            });

        return () => {
            window.Echo.leave(`task.${task.id}`);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('comments.store', {
            project: task.project_id, 
            task: task.id            
        }), {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Tarea: ${task.title}`} />

            <div className="max-w-3xl px-4 py-12 mx-auto">
                {/* Encabezado de la tarea */}
                <div className="mb-8">
                    <Link 
                        href={route('projects.show', task.project_id)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        ← Volver al proyecto
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold">{task.title}</h1>
                </div>

                {/* Sección de Comentarios */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="mb-6 text-xl font-semibold">Comentarios ({comments.length})</h2>

                    {/* Listado de Comentarios */}
                    <div className="mb-8 space-y-6">
                        {comments.map(comment => (
                            <div key={comment.id} className="pl-4 border-l-4 border-blue-500">
                                <div className="flex items-start gap-3">
                                    <img 
                                        src={comment.user.avatar_url} 
                                        className="w-10 h-10 rounded-full" 
                                        alt={comment.user.name}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">{comment.user.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </span>
                                            {comment.user_id === auth.user.id && (
                                                <Link
                                                    method="delete"
                                                    href={route('comments.destroy', comment.id)}
                                                    className="text-sm text-red-500 hover:text-red-700"
                                                >
                                                    Eliminar
                                                </Link>
                                            )}
                                        </div>
                                        <p className="text-gray-800 whitespace-pre-line">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Formulario de nuevo comentario */}
                    <form onSubmit={handleSubmit} className="pt-6 border-t">
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Escribe un comentario..."
                            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? 'Enviando...' : 'Comentar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}