import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AnnoService } from './anno.service';
import { CreateAnnoDto } from './dto/create-anno.dto';

@Controller('anno')
export class AnnoController {
  constructor(private readonly annoService: AnnoService) {}

  @Post()
  async create(@Body() createAnnoDto: CreateAnnoDto) {
    await this.annoService.create(createAnnoDto);
    return { code: 200, errMsg: 'ok' };
  }

  @Get()
  async findAll() {
    return await this.annoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.annoService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annoService.remove(+id);
  }
}
