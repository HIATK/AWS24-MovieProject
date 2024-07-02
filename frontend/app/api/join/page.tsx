"use client"

import Join from "@/app/component/Join";
import styles from "@/app/page.module.css";

export default function join(){
    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Join/>
            </div>
        </main>
    );
}