"use client"
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Image from 'next/image';
import styles from './pload.module.css';

const Upload = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('memberId', '1'); // 실제 멤버 ID로 대체해야 합니다.

        axios.post('/api/profile/upload', formData)
            .then(response => {
                setUploadedImage(URL.createObjectURL(file));
                // 섬네일 이미지 URL을 설정합니다.
                setThumbnail(URL.createObjectURL(file)); // 실제로는 서버에서 생성된 섬네일 URL을 받아와야 합니다.
            })
            .catch(error => {
                console.error('Image upload failed:', error);
            });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className={styles.container}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>이미지를 여기에 드롭하거나 클릭하여 업로드하세요.</p>
            </div>
            {uploadedImage && (
                <div>
                    <h3>업로드된 이미지:</h3>
                    <Image src={uploadedImage} alt="Uploaded" width={200} height={200} />
                </div>
            )}
            {thumbnail && (
                <div>
                    <h3>섬네일 이미지:</h3>
                    <Image src={thumbnail} alt="Thumbnail" width={100} height={100} />
                </div>
            )}
        </div>
    );
};

export default Upload;