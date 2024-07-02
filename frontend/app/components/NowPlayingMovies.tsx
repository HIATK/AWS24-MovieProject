type Movie = {
  id: string;
  title: string;
  poster_path: string;
};

async function getMovies(): Promise<Movie[]> {
  const response = await fetch('http://localhost:8000/api/movies/now-playing');
  const movies: Movie[] = await response.json();
  return movies;
}

export default async function NowPlayingMovies() {
  let movies: Movie[] = [];
  
  try {
    movies = await getMovies();
  } catch (error) {
    console.error('Error fetching movies:', error);
    // API 요청 중 오류가 발생했을 경우 처리할 수 있는 코드 추가
  }

  return (
    <div>
      <h1>All Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <h3>{movie.title}</h3>
            {movie.poster_path && (
              <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={`Poster for ${movie.title}`} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
