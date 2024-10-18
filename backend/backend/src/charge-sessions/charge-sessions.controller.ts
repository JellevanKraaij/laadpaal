import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ChargeSessionsService } from './charge-sessions.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('charge-sessions')
export class ChargeSessionsController {
  constructor(private readonly chargeSessionsService: ChargeSessionsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Query('cardSerial') cardSerial: string) {
    return this.chargeSessionsService.create(cardSerial);
  }

  @Get()
  findAll() {
    return this.chargeSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chargeSessionsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('start/:id')
  start(@Param('id') id: string, @Query('wh', ParseIntPipe) wh: number) {
    return this.chargeSessionsService.begin(id, wh);
  }

  @UseGuards(AuthGuard)
  @Post('end/:id')
  end(@Param('id') id: string, @Query('wh', ParseIntPipe) wh: number) {
    return this.chargeSessionsService.end(id, wh);
  }
}
