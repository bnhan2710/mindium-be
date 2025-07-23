import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UnfollowUserCommand } from '../implements/unfollow-user.command';
import { FollowDomainService } from '@modules/follows/domain/services/follow-domain.service';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';

@CommandHandler(UnfollowUserCommand)
export class UnfollowUserHandler implements ICommandHandler<UnfollowUserCommand> {
	constructor(
		@Inject(FOLLOW_TOKENS.DOMAIN_SERVICE)
		private readonly followDomainService: FollowDomainService,
	) {}

	async execute(command: UnfollowUserCommand): Promise<void> {
		const { followerId, followeeId } = command;

		await this.followDomainService.removeFollowRelationship(followerId, followeeId);
	}
}
