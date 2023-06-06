import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Check])],
  controllers: [CheckController],
  providers: [CheckService],
})
export class CheckModule {}
