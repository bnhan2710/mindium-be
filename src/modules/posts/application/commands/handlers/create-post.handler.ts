import { CommandHandler } from "@nestjs/cqrs";
import { ICommandHandler } from "@nestjs/cqrs";
import { CreatePostCommand } from "../implements/create-post.command";
import { IPostRepository } from "@modules/posts/domain/port/repositories/post.repository";
import { PostEntity } from "@modules/posts/domain/entities/post.entity";

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
    constructor(private readonly postRepository: IPostRepository) {}
    
    async execute(command: CreatePostCommand): Promise<void> {
        const { createPostDto, authorId } = command;
        
        // // Create a new PostEntity instance
        // const post = new PostEntity({
        // title: createPostDto.title,
        // content: createPostDto.content,
        // authorId: authorId,
        // });
    
        // await this.postRepository.save(post);
    }
    }