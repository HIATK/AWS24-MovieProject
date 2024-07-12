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

export interface Member {
    memberNo: number;
    memberEmail: string;
    memberName: string;
    memberPhone: string;
    memberNick: string;
}

export interface UpdateForm {
    memberEmail: string;
    memberName: string;
    memberPhone: string;
    memberNick: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface Errors {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    memberNick?: string;
}