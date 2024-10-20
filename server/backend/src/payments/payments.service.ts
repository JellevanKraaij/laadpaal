import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createPaymentDto: CreatePaymentDto) {
    return this.databaseService.payments.create({
      data: {
        card: { connect: { id: createPaymentDto.cardId } },
        whPaid: createPaymentDto.whPaid,
        description: createPaymentDto.description,
      },
    });
  }

  async findAll() {
    return this.databaseService.payments.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.payments.findUnique({
      where: { id: id },
    });
  }
}
