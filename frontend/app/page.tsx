import Image from "next/image";
import styles from "./page.module.css";

//네비게이션(사이드바)
import Navigation from "./component/Navigation";
 
//네비게이션(사이드바) end

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {/* <Navigation/> */}
      </div>
    </main>
  );
}
