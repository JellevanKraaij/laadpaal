import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ChargeSessionsModule } from './charge-sessions/charge-sessions.module';
import { LogsModule } from './logs/logs.module';
import { CardsModule } from './cards/cards.module';
import { TotalsModule } from './totals/totals.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    DatabaseModule,
    ChargeSessionsModule,
    LogsModule,
    CardsModule,
    TotalsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
