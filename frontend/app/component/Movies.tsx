// components/Movies.tsx

import { useEffect, useState } from 'react';

const Movies = () => {
    const [posters, setPosters] = useState<string[]>([]);

    useEffect(() => {
        // Spring Boot의 API 엔드포인트 호출
        fetch('/api/movies')
            .then(response => response.json())
            .then(data => {
                setPosters(data);
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
            });
    }, []);

    return (
        <div>
            <h1>Movie Posters</h1>
            <div>
                {posters.map((poster, index) => (
                    <img key={index} src={`https://image.tmdb.org/t/p/w500/${poster}`} alt={`Movie Poster ${index}`} />
                ))}
            </div>
        </div>
    );
};

export default Movies;
