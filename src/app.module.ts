import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MondayModule } from './monday/monday.module';
import { MondayItemModule } from './monday-item/monday-item.module';
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});
@Module({
  imports: [MondayModule, MondayItemModule, envModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
