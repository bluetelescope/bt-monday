import { Module } from '@nestjs/common';
import { TimetrackingController } from './timetracking.controller';
import { TimetrackingService } from './timetracking.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [TimetrackingController],
  providers: [TimetrackingService],
})
export class TimetrackingModule {}
