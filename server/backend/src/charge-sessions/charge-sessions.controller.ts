import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ChargeSessionsService } from './charge-sessions.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('charge-sessions')
export class ChargeSessionsController {
  constructor(private readonly chargeSessionsService: ChargeSessionsService) {}

  @Get()
  findAll() {
    return this.chargeSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chargeSessionsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body('cardSerial') cardSerial: string) {
    return this.chargeSessionsService.create(cardSerial);
  }

  @UseGuards(AuthGuard)
  @Post('begin/:id')
  start(@Param('id') id: string, @Body('wh', ParseIntPipe) wh: number) {
    return this.chargeSessionsService.begin(id, wh);
  }

  @UseGuards(AuthGuard)
  @Post('end/:id')
  end(@Param('id') id: string, @Body('wh', ParseIntPipe) wh: number) {
    return this.chargeSessionsService.end(id, wh);
  }
}
