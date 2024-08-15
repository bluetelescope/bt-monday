import { Module } from '@nestjs/common';
import { PopulateController } from './populate.controller';
import { PopulateService } from './populate.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [PopulateController],
  providers: [PopulateService],
})
export class MondayModule {}
