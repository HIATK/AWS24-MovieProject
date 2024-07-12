// src/components/DarkmodToggle.tsx
'use client'
import { useState, useEffect } from 'react';
import {isDarkMode, toggleTheme} from "@/(components)/DarkModToggle/theme";

const DarkmodToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        setDarkMode(isDarkMode());
    }, []);

    const handleToggle = () => {
        toggleTheme();
        setDarkMode(!darkMode);
    };

    return (
        <button onClick={handleToggle}>
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
    );
};

export default DarkmodToggle;