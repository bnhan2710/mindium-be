import { PostEntity } from "../../entities/post.entity";

export interface IPostRepository {
    findById(postId: string): Promise<PostEntity | null>;
    save(post: PostEntity): Promise<void>;
}