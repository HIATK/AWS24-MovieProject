import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { MovieDetails } from "@/(types)/types";
import styles from "./LikeList.module.css";

interface LikeListProps {
    movies: MovieDetails[] | null;
}

const LikeList: React.FC<LikeListProps> = ({ movies }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
        setScrollLeft(sliderRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 100; // Scroll speed
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = Math.max(-1, Math.min(1, e.deltaY || -e.detail));

        requestAnimationFrame(() => {
            if (sliderRef.current) {
                sliderRef.current.scrollLeft += delta * 1000; // 스크롤 속도 조절
            }
        });
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (slider) {
                slider.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>좋아요 한 영화</h2>
            <div
                className={styles.sliderWrapper}
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <div className={styles.movieItems}>
                    {movies !== null && movies.map((movie) => (
                        <div key={movie.id} className={styles.movieItem}>
                            <Link href={`/movies/details/${movie.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                                    alt={`Poster for ${movie.title}`}
                                    className={styles.movieImg}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LikeList;