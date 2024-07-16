// src/app/page.tsx
'use client'
import React from 'react';
import NowPlayingMovies from "./(components)/NowplayMovies/NowPlayingMovies";
import styles from "./page.module.css";
import SearchBar from "@/(components)/SearchBar/SearchBar";
import {useTheme} from "@/(components)/DarkModToggle/ThemeContext";
import MatrixRainEffect from "@/(components)/RainEffect/MatrixRainEffect";

export default function Index() {
    const {theme} = useTheme();
    return (
        <div className={styles.pageContainer}>
            {theme === 'dark' && <MatrixRainEffect/>}
            <div className={styles.content}>
                <div className={styles.background}/>
                <div className={styles.logoContainer}>
                    <img src="/logo.png" alt="Logo" className={styles.logo}/>
                </div>
                <NowPlayingMovies/>
            </div>
        </div>
    );
}