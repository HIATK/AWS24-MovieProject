import { useEffect, useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello')
            .then(response => response.text())
            .then(data => setMessage(data));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
    </div>
    );
}
