import { Controller, Get } from '@nestjs/common';
import { TotalsService } from './totals.service';

@Controller('totals')
export class TotalsController {
  constructor(private readonly totalsService: TotalsService) {}
  @Get()
  findAll() {
    return this.totalsService.findAll();
  }
}
