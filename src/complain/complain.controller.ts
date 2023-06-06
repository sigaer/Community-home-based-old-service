import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ComplainService } from './complain.service';
import { CreateComplainDto } from './dto/create-complain.dto';

@Controller('complain')
export class ComplainController {
  constructor(private readonly complainService: ComplainService) {}

  @Post()
  async create(@Body() createComplainDto: CreateComplainDto) {
    return await this.complainService.create(createComplainDto);
  }

  @Get()
  async findAll() {
    const clist = await this.complainService.findAll();
    return {
      code: 200,
      clist,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.complainService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.complainService.remove(+id);
  }
}
