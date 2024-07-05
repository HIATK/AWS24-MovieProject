"use client";

import React, { useState } from 'react';
import styles from "@/app/page.module.css";
import Mypage from "@/app/components/Member/Mypage";

export default function mypage(){

    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Mypage/>
            </div>
        </main>
    );
}