import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TimetrackingModule } from './timetracking/timetracking.module';
import { PopulateModule } from './populate/populate.module';
import { PopulateSubitemsModule } from './populate-subitems/populate-subitems.module';
import { CostUpdateModule } from './cost-update/cost-update.module';
import { GoogleModule } from './google/google.module';
import { LOASModule } from './loas/loas.module';
import { AppService } from './app.service';
import { MondayModule } from './monday/monday.module';
import { MondayItemModule } from './monday-item/monday-item.module';

@Module({
  imports: [
    MondayModule,
    MondayItemModule,
    TimetrackingModule,
    PopulateModule,
    CostUpdateModule,
    GoogleModule,
    LOASModule,
    PopulateSubitemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
