"use client";

import React, { useState } from 'react';
import styles from "@/page.module.css";

export default function mypage(){

    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Mypage/>
            </div>
        </main>
    );
}