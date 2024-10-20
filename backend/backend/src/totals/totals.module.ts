import { Module } from '@nestjs/common';
import { TotalsService } from './totals.service';
import { TotalsController } from './totals.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TotalsController],
  providers: [TotalsService],
})
export class TotalsModule {}
