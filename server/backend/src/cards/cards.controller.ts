import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  updateName(@Param('id') id: string, @Query('name') name: string) {
    return this.cardsService.updateName(id, name);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/balance/:value')
  updateBalance(
    @Param('id') id: string,
    @Param('value', ParseIntPipe) value: number,
  ) {
    return this.cardsService.updateBalance(id, value);
  }
}
