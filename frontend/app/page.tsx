import styles from "./page.module.css";

import NowPlayingMovies from "./(components)/NowPlayingMovies";

export default function Index() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <NowPlayingMovies />
      </div>
    </main>
  );
}
