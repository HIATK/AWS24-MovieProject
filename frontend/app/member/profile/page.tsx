"use client";

import React, { useState } from 'react';
import styles from "@/page.module.css";
import Profile from "@/(components)/Profile/Profile";

export default function profile(){

    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Profile/>
            </div>
        </main>
    );
}