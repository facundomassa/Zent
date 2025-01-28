import React from 'react';
import { Link } from '@inertiajs/react';

export default function CommentList({ comments }) {
    return (
        <div className="mt-4 space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center mb-2">
                        <span className="font-bold text-sm">{comment.user.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                            {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-gray-800">{comment.content}</p>
                </div>
            ))}
        </div>
    );
}