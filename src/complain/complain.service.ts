import { Injectable } from '@nestjs/common';
import { CreateComplainDto } from './dto/create-complain.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complain } from './entities/complain.entity';
@Injectable()
export class ComplainService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
  ) {}
  async create(createComplainDto: CreateComplainDto) {
    return await this.complainRepository.save(createComplainDto);
  }

  async findAll() {
    return await this.complainRepository.find();
  }

  async findOne(id: number) {
    return await this.complainRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.complainRepository.delete({ id });
  }
}
