import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TimetrackingModule } from './timetracking/timetracking.module';
import { AppService } from './app.service';
import { MondayModule } from './monday/monday.module';
import { MondayItemModule } from './monday-item/monday-item.module';

@Module({
  imports: [MondayModule, MondayItemModule, TimetrackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
