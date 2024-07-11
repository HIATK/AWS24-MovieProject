'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MoviePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.back();
    }, 1000); // 0.1초 후에 실행

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [router]);

  return '페이지가 새로고침 되었습니다 이전 페이지로 되돌아갑니다';
}
