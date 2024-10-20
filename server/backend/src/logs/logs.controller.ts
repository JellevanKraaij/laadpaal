import {
  Controller,
  Get,
  Post,
  UseGuards,
  ParseIntPipe,
  Query,
  Body,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body('wh', ParseIntPipe) wh: number,
    @Body('chargeSessionId') chargeSessionId?: string,
  ) {
    return this.logsService.create(wh, chargeSessionId);
  }

  @Get()
  findAll(@Query('last') last?: number) {
    return this.logsService.findAll(+last);
  }
}
