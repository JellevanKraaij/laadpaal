import { Module } from '@nestjs/common';
import { ChargeSessionsService } from './charge-sessions.service';
import { ChargeSessionsController } from './charge-sessions.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChargeSessionsController],
  providers: [ChargeSessionsService],
})
export class ChargeSessionsModule {}
