import React from 'react';

export default function Input({ type = 'text', className = '', error, ...props }) {
    return (
        <input
            type={type}
            className={`rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${className} ${
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            {...props}
        />
    );
}