'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './SearchBar.module.css';
import { useTheme } from '@/(components)/DarkModToggle/ThemeContext';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    underlineColor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ underlineColor = '#ffffff' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const hiddenButtonRef = useRef<HTMLButtonElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setSearchTerm('');
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hiddenButtonRef.current) {
            hiddenButtonRef.current.click();
        }
    };

    return (
        <div className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ''}`}>
            <button type="button" onClick={handleToggle} className={styles.searchButton}>
                <FaSearch className={`${styles.searchIcon} ${styles[theme]}`} size={24} />
            </button>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type to search.."
                    className={styles.searchInput}
                />
                <div className={styles.underline} style={{ backgroundColor: underlineColor }}></div>
            </form>
            <Link href={`/movies/search?keyword=${encodeURIComponent(searchTerm)}`} passHref>
                <button ref={hiddenButtonRef} style={{ display: 'none' }}>Search</button>
            </Link>
        </div>
    );
};

export default SearchBar;