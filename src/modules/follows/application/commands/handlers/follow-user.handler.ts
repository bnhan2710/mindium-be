import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FollowUserCommand } from '../implements/follow-user.command';
import { FollowDomainService } from '@modules/follows/domain/services/follow-domain.service';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';

@CommandHandler(FollowUserCommand)
export class FollowUserHandler implements ICommandHandler<FollowUserCommand> {
	constructor(
		@Inject(FOLLOW_TOKENS.DOMAIN_SERVICE)
		private readonly followDomainService: FollowDomainService,
	) {}

	async execute(command: FollowUserCommand): Promise<void> {
		const { followerId, followeeId } = command;

		await this.followDomainService.createFollowRelationship(followerId, followeeId);
	}
}
