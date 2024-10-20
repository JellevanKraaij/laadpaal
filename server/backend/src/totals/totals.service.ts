import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TotalsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const chargeWh = await this.databaseService.chargeSessions
      .aggregate({
        _sum: { totalWh: true },
      })
      .then((res) => {
        if (!res._sum || !res._sum.totalWh) {
          return 0;
        }
        return res._sum.totalWh;
      });

    const logWh = await this.databaseService.logs
      .findMany({
        orderBy: { time: 'desc' },
        take: 1,
      })
      .then((res) => {
        return res[0].wh;
      });

    const offsetWh = await this.databaseService.offsets
      .findMany({
        orderBy: { id: 'desc' },
        take: 1,
      })
      .then((res) => {
        if (!res.length) {
          return 0;
        }
        return res[0].whOffset;
      });

    return {
      chargeWh: chargeWh,
      totalWh: logWh,
      idleWh: logWh - chargeWh,
      compareWh: logWh + offsetWh,
    };
  }
}
