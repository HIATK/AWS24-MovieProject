"use client";

import React, { useState } from "react";
import styles from "@/page.module.css";
import Login from "@/(components)/Login/Login";

export default function login(){

    return(
        <main className={styles.main}>
            <div className={styles.description}>
                <Login/>
            </div>
        </main>
    );
}