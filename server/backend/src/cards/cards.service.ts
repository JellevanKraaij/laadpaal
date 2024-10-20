import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CardsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findAll() {
    return this.databaseService.cards.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.cards.findUnique({
      where: { id: id },
      include: {
        chargeSessions: {
          orderBy: { startTime: 'desc' },
        },
      },
    });
  }

  async updateBalance(cardHash: string, value: number) {
    return this.databaseService.cards.update({
      where: { cardHash: cardHash },
      data: { balanceWh: value },
    });
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
