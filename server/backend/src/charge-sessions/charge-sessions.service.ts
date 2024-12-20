import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChargeSessionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return await this.databaseService.chargeSessions.findMany({
      orderBy: { startTime: 'desc' },
    });
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

    const cards = await this.databaseService.cards.findMany();
    const card = cards.find((card) => {
      if (bcrypt.compareSync(cardSerial, card.cardHash)) {
        return card;
      }
    });

    if (!card) {
      throw new HttpException('Card not found', 404);
    }

    if (!card.isValid) {
      throw new HttpException('Card is not valid', 403);
    }

    await this.databaseService.cards.update({
      where: { cardHash: card.cardHash },
      data: { lastUsed: new Date() },
    });

    const chargeSession = await this.databaseService.chargeSessions.create({
      data: {
        card: { connect: { id: card.id } },
      },
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

    let totalWh = wh - chargeSession.startWh;
    if (totalWh < 0) {
      totalWh = 0;
    }

    await this.databaseService.cards.update({
      where: { id: chargeSession.cardId },
      data: {
        totalWh: { increment: totalWh },
      },
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
