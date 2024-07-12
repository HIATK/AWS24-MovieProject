import NowPlayingMovies from "./(components)/NowplayMovies/NowPlayingMovies";
import styles from "./page.module.css";
import SearchBar from "@/(components)/SearchBar/SearchBar";
import ThemeToggle from "@/(components)/DarkModToggle/ThemeToggle";
export default function Index() {
  return (
    <div>
    <div className={styles.background} />
      <main className={styles.main}>
        <div className={styles.description}>
          <SearchBar underlineColor="#5FBEBBFF"/>
          <ThemeToggle/>
          <NowPlayingMovies />
        </div>
      </main>
    </div>
  );
}
