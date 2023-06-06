import { Injectable } from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Check } from './entities/check.entity';
@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private readonly checkRepository: Repository<Check>,
  ) {}
  async create(createCheckDto: CreateCheckDto) {
    await this.checkRepository.save(createCheckDto);
    return 'This action adds a new check';
  }

  findAll() {
    return `This action returns all check`;
  }

  findOne(id: number) {
    return `This action returns a #${id} check`;
  }

  remove(id: number) {
    return `This action removes a #${id} check`;
  }
}
