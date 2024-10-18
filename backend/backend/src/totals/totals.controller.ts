import { Controller } from '@nestjs/common';
import { TotalsService } from './totals.service';

@Controller('totals')
export class TotalsController {
  constructor(private readonly totalsService: TotalsService) {}
}
