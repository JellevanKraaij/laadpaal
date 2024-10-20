import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { CardsService } from './cards.service';

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
  updateName(@Param('id') id: string, @Body('name') name: string) {
    return this.cardsService.updateName(id, name);
  }
}
