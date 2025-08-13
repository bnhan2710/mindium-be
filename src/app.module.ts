import { Module, NestModule } from '@nestjs/common';
import { SecurityModule } from '@libs/security/security.module';
import { ConfigsModule } from '@libs/config/configs.module';
import { DatabaseModule } from '@libs/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { PostModule } from './modules/posts/post.module';
import { CQRSModule } from '@libs/cqrs/cqrs.module';
import { FollowModule } from './modules/follows/follow.module';
import { MessagingModule } from '@libs/messaging/messaging.module';
@Module({
	imports: [
		ConfigsModule,
		CQRSModule,
		SecurityModule,
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
