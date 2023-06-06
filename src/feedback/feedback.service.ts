import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly commentRepository: Repository<Feedback>,
  ) {}
  async create(createFeedbackDto: CreateFeedbackDto) {
    return await this.commentRepository.save(createFeedbackDto);
  }

  async findAll() {
    return await this.commentRepository.find();
  }

  async findOne(id: number) {
    return await this.commentRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.commentRepository.delete({ id });
  }
}
