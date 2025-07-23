import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import {
	FollowDocument,
	FollowSchema,
} from './infrastructure/adapter/persistence/schema/follow.schema';
import { FollowUserHandler } from './application/commands/handlers/follow-user.handler';
import { UnfollowUserHandler } from './application/commands/handlers/unfollow-user.handler';
import { GetFollowersHandler } from './application/queries/handlers/get-followers.handler';
import { GetFollowingHandler } from './application/queries/handlers/get-following.handler';
import { GetFollowCountsHandler } from './application/queries/handlers/get-follow-counts.handler';
import { CheckIsFollowingHandler } from './application/queries/handlers/check-is-following.handler';
import { FollowController } from './presentation/http/follow.controller';
import { MongoFollowRepository } from './infrastructure/adapter/persistence/mongodb/mongo-follow.repository';
import { FollowDomainService } from './domain/services/follow-domain.service';
import { FOLLOW_TOKENS } from './follow-tokens';
import { UserModule } from '@modules/users/user.module';

const commandHandlers = [FollowUserHandler, UnfollowUserHandler];

const queryHandlers = [
	GetFollowersHandler,
	GetFollowingHandler,
	GetFollowCountsHandler,
	CheckIsFollowingHandler,
];

@Module({
	imports: [
		CqrsModule,
		MongooseModule.forFeature([{ name: FollowDocument.name, schema: FollowSchema }]),
		UserModule,
	],
	controllers: [FollowController],
	providers: [
		...commandHandlers,

		...queryHandlers,

		{
			provide: FOLLOW_TOKENS.DOMAIN_SERVICE,
			useClass: FollowDomainService,
		},
		{
			provide: FOLLOW_TOKENS.REPOSITORY,
			useClass: MongoFollowRepository,
		},
	],
	exports: [FOLLOW_TOKENS.REPOSITORY],
})
export class FollowModule {}
