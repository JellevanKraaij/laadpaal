import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChargeSessionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return await this.databaseService.withExtensions().chargeSessions.findMany({
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.databaseService.withExtensions().chargeSessions.findUnique({
      where: { id: id },
      include: {
        logs: {
          orderBy: { time: 'desc' },
        },
      },
    });
  }

  async create(cardSerial: string) {
    if (!cardSerial) {
      throw new HttpException('cardSerial is required', 400);
    }
    const card = await this.databaseService.cards.findUnique({
      where: { cardSerial: cardSerial },
    });

    if (!card) {
      throw new HttpException('Card not found', 404);
    }
    if (!card.isValid) {
      throw new HttpException('Card is not valid', 403);
    }

    await this.databaseService.cards.update({
      where: { cardSerial: cardSerial },
      data: { lastUsed: new Date() },
    });

    const chargeSession = await this.databaseService
      .withExtensions()
      .chargeSessions.create({
        data: { cardSerial: cardSerial },
      });
    return chargeSession.id;
  }

  async begin(id: string, wh: number) {
    const chargeSession = await this.databaseService
      .withExtensions()
      .chargeSessions.findUnique({
        where: { id: id },
      });

    if (!chargeSession) {
      throw new HttpException('Charge session not found', 404);
    }
    if (chargeSession.startTime) {
      throw new HttpException('Charge session already started', 403);
    }

    return this.databaseService.chargeSessions.update({
      where: { id: id },
      data: { startTime: new Date(), startWh: wh },
    });
  }

  async end(id: string, wh: number) {
    const chargeSession = await this.databaseService
      .withExtensions()
      .chargeSessions.findUnique({
        where: { id: id },
      });

    if (!chargeSession) {
      throw new HttpException('Charge session not found', 404);
    }
    if (!chargeSession.startTime) {
      throw new HttpException('Charge session not started', 403);
    }
    if (chargeSession.endTime) {
      throw new HttpException('Charge session already ended', 403);
    }

    let totalWh = wh - chargeSession.startWh;
    if (totalWh < 0) {
      totalWh = 0;
    }

    await this.databaseService.cards.update({
      where: { cardSerial: chargeSession.cardSerial },
      data: {
        totalWh: { increment: totalWh },
        balanceWh: { decrement: totalWh },
      },
    });

    return this.databaseService.chargeSessions.update({
      where: { id: id },
      data: {
        endTime: new Date(),
        endWh: wh,
      },
    });
  }
}
