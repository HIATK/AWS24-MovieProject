export interface PostDetails {
    postId: number;
    postContent: string;
    ratingStar: number;
    regDate: string;
    memberNick: string;
}

export interface MovieDetails {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number;
    genres: { name: string }[];
}