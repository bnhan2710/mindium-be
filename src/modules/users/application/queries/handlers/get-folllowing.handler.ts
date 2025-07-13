import { IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import { GetFollowingQuery } from "../implements/get-following.query";
import { Inject, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "@modules/users/domain/ports/repositories/user.repository";
import { USER_DI_TOKENS } from "@modules/users/user.di-tokens";
import { UserApplicationDto } from "../../dtos/user-application.dto";
import { UserNotFoundError } from '@modules/users/domain/errors';

@QueryHandler(GetFollowingQuery)
export class GetFollowingQueryHandler implements IQueryHandler<GetFollowingQuery> {
    constructor(
        @Inject(USER_DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(query: GetFollowingQuery): Promise<UserApplicationDto[]> {
        const { userId } = query;
        const follwings = await this.userRepository.findByIdWithFollowings(userId);
        if (!follwings) {
            throw new UserNotFoundError(userId);
        }
        return follwings.map(following => UserApplicationDto.fromDomain(following));
    }
}