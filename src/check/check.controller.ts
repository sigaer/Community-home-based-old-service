import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Post()
  create(@Body() createCheckDto: CreateCheckDto) {
    return this.checkService.create(createCheckDto);
  }

  @Get()
  findAll() {
    return this.checkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkService.remove(+id);
  }
}
