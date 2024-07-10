'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
    underlineColor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ underlineColor = '#ffffff' }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isExpanded])

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
        if (!isExpanded) {
            setSearchTerm('')
        }
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Searching for:', searchTerm)
        // 여기에 검색 로직을 구현합니다
    }

    return (
        <div className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ''}`}>
            <button type="button" onClick={handleToggle} className={styles.searchButton}>
                <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
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
        </div>
    )
}

export default SearchBar