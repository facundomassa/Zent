import React from 'react';

export default function Label({ htmlFor, value, className = '', children, ...props }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 ${className}`}
            {...props}
        >
            {value || children}
        </label>
    );
}