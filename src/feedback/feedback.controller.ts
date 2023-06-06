import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  async findAll() {
    const flist = await this.feedbackService.findAll();
    return {
      code: 200,
      flist,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.feedbackService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.feedbackService.remove(+id);
  }
}
