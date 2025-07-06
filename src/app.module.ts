import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { DatabaseModule } from '@shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
@Module({
	imports: [SharedModule, DatabaseModule, AuthModule, UserModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
