import {
  Controller,
  Get,
  Post,
  UseGuards,
  ParseIntPipe,
  Query,
  Body,
} from '@nestjs/common';
import { LogService } from './log.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body('wh', ParseIntPipe) wh: number,
    @Body('chargeSessionId') chargeSessionId?: string,
  ) {
    return this.logService.create(wh, chargeSessionId);
  }

  @Get()
  findAll(@Query('last') last: number) {
    return this.logService.findAll(+last);
  }
}
