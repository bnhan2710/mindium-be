import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetUserPostQuery } from "../implements/get-user-post.query";
import { IPostRepository } from "@modules/post/domain/port/repositories/post.repository";
import { PostResponseDto } from "../../dtos/post-response.dto";
import { POST_TOKENS } from "@modules/post/post.tokens";
import { PageRequest } from "@shared/common/dtos";

@QueryHandler(GetUserPostQuery)
export class GetUserPostQueryHandler implements IQueryHandler<GetUserPostQuery> {
    constructor(
        @Inject(POST_TOKENS.POST_REPOSITORY)
        private readonly postRepository: IPostRepository
    ) {}

    async execute(query: GetUserPostQuery): Promise<any> {
        const { userId, pagination } = query;

        const pageRequest  =  PageRequest.of(pagination);

        const posts = await this.postRepository.findByUserId(userId, pageRequest);

        return PostResponseDto.fromDomainList(posts);
    }
}