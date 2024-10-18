import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ChargeSessionsModule } from './charge-sessions/charge-sessions.module';
import { LogModule } from './log/log.module';
import { CardsModule } from './cards/cards.module';
import { TotalsModule } from './totals/totals.module';

@Module({
  imports: [
    DatabaseModule,
    ChargeSessionsModule,
    LogModule,
    CardsModule,
    TotalsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
