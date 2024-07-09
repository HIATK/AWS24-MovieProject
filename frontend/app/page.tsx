import NowPlayingMovies from "./(components)/NowplayMovies/NowPlayingMovies";
import styles from "./page.module.css";
export default function Index() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <NowPlayingMovies />
      </div>
    </main>
  );
}
