import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CardsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findAll() {
    return this.databaseService.cards.findMany();
  }

  async findOne(id: string) {
    const card = await this.databaseService.cards.findUnique({
      where: { id: id },
      include: {
        chargeSessions: {
          orderBy: { startTime: 'desc' },
        },
        payments: {
          orderBy: { createTime: 'desc' },
        },
      },
    });
    if (!card) {
      throw new HttpException('Card not found', 404);
    }

    const whPaid = await this.databaseService.payments
      .aggregate({
        _sum: { whPaid: true },
        where: { cardId: card.id },
      })
      .then((res) => {
        if (!res._sum || !res._sum.whPaid) {
          return 0;
        }
        return res._sum.whPaid;
      });

    const cardExtended = {
      ...card,
      balance: whPaid - card.totalWh,
    };

    return cardExtended;
  }

  async updateName(cardHash: string, name: string) {
    if (!name) {
      throw new HttpException('Name is required', 400);
    }
    return this.databaseService.cards.update({
      where: { cardHash: cardHash },
      data: { name: name },
    });
  }
}
