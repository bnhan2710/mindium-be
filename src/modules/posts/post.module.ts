import { Module } from '@nestjs/common';
import { PostController } from './presentation/http/controllers/post.controller';
import { POST_TOKENS } from './post.tokens';
import { MongoPostRepository } from './infrastructure/adapters/persistence/mongodb/mongo-post.repository';
import {
	PostSchema,
	PostModel,
} from './infrastructure/adapters/persistence/schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PublishPostHandler } from './application/commands/handlers/publish-post.command-handler';
import { GetPostDetailsQueryHandler } from './application/queries/handlers/get-post-detail.query-handler';
import { GetUserPostsQueryHandler } from './application/queries/handlers/get-user-post.query-handler';
import { EditPostCommandHanler } from './application/commands/handlers/edit-post.command-handler';
import { DeletePostCommandHandler } from './application/commands/handlers/delete-post.command';

const CommandHandlers = [
	PublishPostHandler,
	EditPostCommandHanler,
	DeletePostCommandHandler,
];

const QueryHandlers = [GetPostDetailsQueryHandler, GetUserPostsQueryHandler];

const Repositories = [
	{
		provide: POST_TOKENS.POST_REPOSITORY,
		useClass: MongoPostRepository,
	},
];

@Module({
	imports: [MongooseModule.forFeature([{ name: PostModel.name, schema: PostSchema }])],
	providers: [
		...CommandHandlers,
		...QueryHandlers,
		...Repositories,
		MongoPostRepository,
	],
	exports: [...Repositories, MongoPostRepository],
	controllers: [PostController],
})
export class PostModule {}
