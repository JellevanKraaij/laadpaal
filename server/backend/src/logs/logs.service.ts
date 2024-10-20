import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(wh: number, chargeSessionId: string) {
    if (!chargeSessionId) {
      return this.databaseService.logs.create({
        data: { wh: wh },
      });
    }
    const chargeSession = await this.databaseService.chargeSessions.findUnique({
      where: { id: chargeSessionId },
    });
    if (!chargeSession) {
      throw new HttpException('Charge session not found', 404);
    }

    if (chargeSession.endTime) {
      throw new HttpException('Charge session already ended', 403);
    }

    return this.databaseService.logs.create({
      data: { wh: wh, chargeSession: { connect: { id: chargeSessionId } } },
    });
  }

  async findAll(last: number) {
    if (!last) {
      last = 100;
    }
    return this.databaseService.logs.findMany({
      take: last,
      orderBy: { time: 'desc' },
    });
  }
}
