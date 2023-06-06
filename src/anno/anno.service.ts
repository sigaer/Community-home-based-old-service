import { Injectable } from '@nestjs/common';
import { CreateAnnoDto } from './dto/create-anno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anno } from './entities/anno.entity';
@Injectable()
export class AnnoService {
  constructor(
    @InjectRepository(Anno)
    private readonly annoRepository: Repository<Anno>,
  ) {}
  async create(createAnnoDto: CreateAnnoDto) {
    return await this.annoRepository.save(createAnnoDto);
  }

  async findAll() {
    return await this.annoRepository.find();
  }

  async findOne(id: number) {
    return await this.annoRepository.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} anno`;
  }
}
