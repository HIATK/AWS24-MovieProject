"use client";

import { useParams } from "next/navigation";
import NowPlayingMovies from "@/(components)/NowPlayingMovies";

export default function MoviePage() {
  const params = useParams();

  return <NowPlayingMovies initialMovieId={params.id as string} />;
}
