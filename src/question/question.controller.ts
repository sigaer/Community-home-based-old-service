import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    console.log('id');
    return this.questionService.findOne(+id);
  }

  @Get('search')
  findList(@Query() query) {
    console.log('search');
    return this.questionService.findList(query.prompt);
  }

  @Get('comment')
  getCommentList(@Query() query) {
    return this.questionService.getCommentList(query.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
