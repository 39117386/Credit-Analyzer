"use client";

import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = "Error"
}) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-red-900 border-2 border-red-500 text-red-200 px-6 py-8 rounded-2xl text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;