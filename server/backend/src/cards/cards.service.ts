import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CardsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findAll() {
    return this.databaseService.withExtensions().cards.findMany();
  }

  async findOne(cardSerial: string) {
    return this.databaseService.withExtensions().cards.findUnique({
      where: { cardSerial: cardSerial },
      include: {
        chargeSessions: {
          orderBy: { startTime: 'desc' },
        },
      },
    });
  }

  async updateBalance(cardSerial: string, value: number) {
    return this.databaseService.cards.update({
      where: { cardSerial: cardSerial },
      data: { balanceWh: value },
    });
  }

  async updateName(cardSerial: string, name: string) {
    if (!name) {
      throw new HttpException('Name is required', 400);
    }
    return this.databaseService.cards.update({
      where: { cardSerial: cardSerial },
      data: { name: name },
    });
  }
}
