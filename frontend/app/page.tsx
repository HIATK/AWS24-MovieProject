import styles from "./page.module.css";

//네비게이션(사이드바)
import Navigation from "./component/Navigation";
import Hello from "./component/Hello";
 
//네비게이션(사이드바) end

export default function Index() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Navigation/>
        <Hello />
      </div>
    </main>
  );
}
