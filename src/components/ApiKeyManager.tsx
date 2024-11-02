'use client'; // Ensure this is a client component
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"


interface ApiKeyManagerProps {
    token: string;
}

interface ErrorResponse {
    error: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ token }) => {
    const [apiKeys, setApiKeys] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [helloResponse, setHelloResponse] = useState<any | null>(null);
    const router = useRouter(); // Initialize router

    const fetchApiKeys = async () => {
        try {
            const response = await axios.get<Array<{ key: string; _id: string }>>('https://api-service-server.vercel.app/auth/keys', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Fetched API keys:', response.data);

            if (Array.isArray(response.data)) {
                const keys = response.data.map((keyObject) => keyObject.key);
                setApiKeys(keys);
            } else {
                console.error('Unexpected API response structure:', response.data);
                setError('Unexpected response structure from the API.');
            }

        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            console.error('Error fetching API keys:', axiosError.response ? axiosError.response.data : axiosError.message);
            setError(axiosError.response?.data.error || 'An unknown error occurred while fetching API keys');
        }
    };

    const createApiKey = async () => {
        try {
            const response = await axios.post<{ apiKey: string }>('https://api-service-server.vercel.app/auth/keys', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setApiKeys((prevKeys) => [...prevKeys, response.data.apiKey]);
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            console.error('Error creating API key:', axiosError);
            setError(axiosError.response?.data.error || 'An unknown error occurred while creating API key');
        }
    };

    const deleteApiKey = async (key: string) => {
        try {
            await axios.delete(`https://api-service-server.vercel.app/auth/keys/${key}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setApiKeys((prevKeys) => prevKeys.filter((k) => k !== key));
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            console.error('Error deleting API key:', axiosError);
            setError(axiosError.response?.data.error || 'An unknown error occurred while deleting API key');
        }
    };

    const fetchHelloMessage = async (key: string) => {
        try {
            const response = await axios.get(`https://api-service-server.vercel.app/api/hello?apiKey=${key}`);
            setHelloResponse(response.data);
        } catch (error) {
            console.error('Error fetching hello message:', error);
            setHelloResponse(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    useEffect(() => {
        fetchApiKeys();
    }, [token]);

    return (
        <div className="p-4">
               <Button onClick={createApiKey} className="mb-4 p-2 rounded mr-4">
                Create API Key
            </Button>
            <Button onClick={handleLogout} className="mb-4 p-2  rounded">
                Logout
            </Button>
         
            {error && <p className="text-red-500">{error}</p>}
           
            <ScrollArea className="h-72 w-full max-w-lg mx-auto rounded-md border overflow-y-auto">
                <div className="p-4">
                    <h4 className="mb-4 text-lg font-semibold leading-none">API keys</h4>
                    {apiKeys.map((tag) => (
                        <React.Fragment key={tag}>
                            <div className="text-sm">
                                {tag}
                                <Button onClick={() => deleteApiKey(tag)} className="text-red-500 ml-5">Delete</Button>
                                <Button onClick={() => fetchHelloMessage(tag)} className="text-blue-500 ml-5">Fetch </Button>
                            </div>
                            <Separator className="my-2" />
                        </React.Fragment>
                    ))}
                </div>
            </ScrollArea>
            <div className="usage mt-4">
    <p className='text-xl font-semibold'>Usage:</p>
    <div className="overflow-x-auto"> {/* Allow horizontal scrolling for code on smaller screens */}
        <pre className="bg-gray-900 text-white p-4 rounded whitespace-pre-wrap break-words"> {/* Added classes for wrapping and breaking long lines */}
{`<script>
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your API key

    fetch(\`https://api-service-server.vercel.app/api/hello?apiKey=\${apiKey}\`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => console.log('Response data:', data))
    .catch(error => console.error('There was a problem with the fetch operation:', error));

</script>`}
        </pre>
    </div>
</div>

            <div className="mt-4">
                {helloResponse && (
                    <pre className="bg-gray-900 text-white p-4 rounded">
                        {JSON.stringify(helloResponse, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default ApiKeyManager;
