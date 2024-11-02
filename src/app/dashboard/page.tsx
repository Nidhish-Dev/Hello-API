'use client'
import React, { useEffect, useState } from 'react';
import ApiKeyManager from '@/components/ApiKeyManager';

const DashboardPage: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            window.location.href = '/login';
        }
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {token ? (
                <>
                    <ApiKeyManager token={token} />
                </>
            ) : (
                <p>Please log in to use the features.</p>
            )}
        </div>
    );
};

export default DashboardPage;
