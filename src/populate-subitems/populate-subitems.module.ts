import { Module } from '@nestjs/common';
import { PopulateSubitemsController } from './populate-subitems.controller';
import { PopulateSubitemsService } from './populate-subitems.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [PopulateSubitemsController],
  providers: [PopulateSubitemsService],
})
export class PopulateSubitemsModule {}
