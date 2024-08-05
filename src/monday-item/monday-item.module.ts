import { Module } from '@nestjs/common';
import { MondayItemService } from './monday-item.service';
import { MondayItemController } from './monday-item.controller';

@Module({
  controllers: [MondayItemController],
  providers: [MondayItemService],
})
export class MondayItemModule {}
