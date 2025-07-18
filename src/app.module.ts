import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { ConfigsModule } from '@configs/configs.module';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { PostModule } from './modules/posts/post.module';
@Module({
	imports: [
		ConfigsModule,
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
