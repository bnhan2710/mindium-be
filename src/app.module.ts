import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { ConfigsModule } from '@configs/configs.module';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CQRSModule } from '@shared/cqrs/cqrs.module';
@Module({
	imports: [
		ConfigsModule,
		CQRSModule,
		SharedModule,
		DatabaseModule,
		AuthModule,
		UserModule,
		PostModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
