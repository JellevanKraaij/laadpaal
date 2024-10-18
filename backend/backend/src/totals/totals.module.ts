import { Module } from '@nestjs/common';
import { TotalsService } from './totals.service';
import { TotalsController } from './totals.controller';

@Module({
  controllers: [TotalsController],
  providers: [TotalsService],
})
export class TotalsModule {}
