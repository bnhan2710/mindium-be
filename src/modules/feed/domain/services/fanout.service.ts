export interface FanoutService {
    run(postData: PostFanoutData): Promise<void>;
}

export interface PostFanoutData {
    postId: string;
    authorId: string;
    title: string;
    content: string;
    summary: string;
    tags: string[];
    createdAt: Date
}