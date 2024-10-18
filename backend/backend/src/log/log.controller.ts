import {
  Controller,
  Get,
  Post,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LogService } from './log.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Query('wh', ParseIntPipe) wh: number,
    @Query('chargeSession') chargeSession: string,
  ) {
    return this.logService.create(wh, chargeSession);
  }

  @Get()
  findAll(@Query('last') last: number) {
    return this.logService.findAll(+last);
  }
}
