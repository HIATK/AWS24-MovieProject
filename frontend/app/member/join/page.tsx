"use client";

import Join from "@/(components)/Member/Join";
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