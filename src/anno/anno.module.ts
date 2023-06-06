import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnoService } from './anno.service';
import { AnnoController } from './anno.controller';
import { Anno } from './entities/anno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anno])],
  controllers: [AnnoController],
  providers: [AnnoService],
})
export class AnnoModule {}
