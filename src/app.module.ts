import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { DatabaseModule } from '@shared/database/database.module';
@Module({
	imports: [SharedModule, DatabaseModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
