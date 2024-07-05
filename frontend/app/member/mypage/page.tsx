"use client";

import React, { useState } from 'react';
import styles from "@/page.module.css";
import Mypage from "@/(components)/Member/Mypage";

export default function mypage(){

    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Mypage/>
            </div>
        </main>
    );
}