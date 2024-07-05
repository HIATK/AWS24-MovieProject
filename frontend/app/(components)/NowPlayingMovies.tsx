import styles from '@/(components)/NowplayingMovies.module.css'

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
    <div className={styles.movielist}>
      <ul className={styles['movie-items']}>
        {movies.map(movie => (
          <li key={movie.id} className={styles['movie-item']}>
            <img
              src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
              alt={`Poster for ${movie.title}`}
              className={styles['movie-img']}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
