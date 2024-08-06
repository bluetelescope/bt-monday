import { Module } from '@nestjs/common';
import { MondayController } from './monday.controller';
import { MondayService } from './monday.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [MondayController],
  providers: [MondayService],
})
export class MondayModule {}
