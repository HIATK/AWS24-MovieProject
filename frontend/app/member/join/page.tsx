"use client";

import Join from "@/(components)/Join/Join";
import styles from "@/page.module.css";

export default function join(){
    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Join/>
            </div>
        </main>
    );
}