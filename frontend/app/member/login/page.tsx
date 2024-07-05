"use client";

import React, { useState } from 'react';
import Login from '@/(components)/Member/Login'; // 실제 경로에 맞게 수정 필요
import styles from "@/page.module.css";

export default function login(){

    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Login/>
            </div>
        </main>
    );
}