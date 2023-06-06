import { Module } from '@nestjs/common';
import { ComplainService } from './complain.service';
import { ComplainController } from './complain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complain } from './entities/complain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Complain])],
  controllers: [ComplainController],
  providers: [ComplainService],
})
export class ComplainModule {}
