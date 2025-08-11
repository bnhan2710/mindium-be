import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { ConfigsModule } from 'src/libs/configs.module';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { PostModule } from './modules/posts/post.module';
import { CQRSModule } from '@shared/cqrs/cqrs.module';
import { FollowModule } from './modules/follows/follow.module';
import { MessagingModule } from '@shared/infrastructure/messaging/messaging.module';
@Module({
	imports: [
		ConfigsModule,
		CQRSModule,
		SharedModule,
		DatabaseModule,
		MessagingModule,
		AuthModule,
		UserModule,
		PostModule,
		FollowModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
