import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const response = await axios.post('http://localhost:8000/api/check-censorship', body, {
            headers: {
                'Authorization': `Bearer ${body.token}` 
            }
        });
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: 'Censorship check failed' }, { status: 500 });
    }
}
