import { Module } from '@nestjs/common';
import { CostUpdateController } from './cost-update.controller';
import { CostUpdateService } from './cost-update.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [CostUpdateController],
  providers: [CostUpdateService],
})
export class CostUpdateModule {}
