'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Check if a token exists in local storage when the component mounts
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleLogout = () => {
        // Clear the token from local storage on logout
        localStorage.removeItem('token');
        setToken(null); // Update the state to reflect logout
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to Censorfy</h1>
            {token ? (
                <div>
                    <p className="mb-4">You are logged in.</p>
                    <Link href="/dashboard" className="p-2 bg-blue-500 text-white rounded">Go to Dashboard</Link>
                    <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded mt-2">Logout</button>
                </div>
            ) : (
                <div>
                    <p className="mb-4">Please log in to access your features.</p>
                    <Link href="/login" className="p-2 bg-green-500 text-white rounded mr-2">Login</Link>
                    <Link href="/signup" className="p-2 bg-blue-500 text-white rounded">Sign Up</Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;
