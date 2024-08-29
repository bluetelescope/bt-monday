import { Module } from '@nestjs/common';
import { LOASController } from './loas.controller';
import { LOASService } from './loas.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [LOASController],
  providers: [LOASService],
})
export class LOASModule {}
