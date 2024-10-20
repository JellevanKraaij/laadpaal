import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TotalsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const chargeWh = await this.databaseService.chargeSessions
      .aggregate({
        _sum: { startWh: true, endWh: true },
      })
      .then((res) => {
        return res._sum.endWh - res._sum.startWh;
      });

    const logWh = await this.databaseService.logs
      .findMany({
        orderBy: { time: 'desc' },
        take: 1,
      })
      .then((res) => {
        return res[0].wh;
      });

    return {
      chargeWh: chargeWh,
      totalWh: logWh,
      idleWh: logWh - chargeWh,
    };
  }
}
