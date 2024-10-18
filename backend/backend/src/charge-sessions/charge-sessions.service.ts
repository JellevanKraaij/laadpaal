import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TotalType } from '@prisma/client';

@Injectable()
export class ChargeSessionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return await this.databaseService.chargeSessions.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.chargeSessions.findUnique({
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

    const chargeSession = await this.databaseService.chargeSessions.create({
      data: { cardSerial: cardSerial },
    });
    return chargeSession.id;
  }

  async begin(id: string, wh: number) {
    const chargeSession = await this.databaseService.chargeSessions.findUnique({
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
    const chargeSession = await this.databaseService.chargeSessions.findUnique({
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

    const totalWh = wh - chargeSession.startWh;

    if (totalWh < 0) {
      throw new HttpException(
        'Invalid endWh, should be greater than startWh',
        400,
      );
    }

    await this.databaseService.cards.update({
      where: { cardSerial: chargeSession.cardSerial },
      data: {
        balanceWh: { decrement: totalWh },
        totalWh: { increment: totalWh },
      },
    });

    await this.databaseService.totals.upsert({
      where: { type: TotalType.TOTAL_CHARGED },
      update: { wh: { increment: totalWh } },
      create: { type: TotalType.TOTAL_CHARGED, wh: totalWh },
    });

    return this.databaseService.chargeSessions.update({
      where: { id: id },
      data: {
        endTime: new Date(),
        endWh: wh,
        totalWh: totalWh,
      },
    });
  }
}
