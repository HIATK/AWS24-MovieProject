import NowPlayingMovies from "./(components)/NowplayMovies/NowPlayingMovies";
import styles from "./page.module.css";
import SearchBar from "@/(components)/SearchBar/SearchBar";

export default function Index() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.background} />
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
      </div>
      <NowPlayingMovies />
    </div>
  );
}
