import { QueryHandler } from "@nestjs/cqrs";
import { GetUserProfileQuery } from "../implements/get-user-profile.query";
import { IUserRepository } from "@modules/users/domain/ports/repositories/user.repository";
import { UserEntity } from "@modules/users/domain/entities/user.entity";
import { Inject, NotFoundException } from "@nestjs/common";
import { DI_TOKENS } from "@modules/users/di-tokens";

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileQueryHandler {
    constructor(
        @Inject(DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    
    async execute(query: GetUserProfileQuery): Promise<UserEntity> {
        const { userId } = query;
        const user = await this.userRepository.findById(userId);
        
        if(!user){
            throw new NotFoundException('User Not Found')
        }

        return user
    }
}