import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyGateway } from './agency.gateway';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.entity';
import { Userser } from '../user/userservice.entity';
import { Question } from 'src/question/entities/question.entity';
import { Comment } from 'src/question/entities/comment.entity';
import { Useraction } from 'src/user/useraction.entity';
import { Userhealth } from 'src/user/userhealth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Userser,
      Question,
      Userhealth,
      Comment,
      Useraction,
    ]),
  ],
  providers: [AgencyGateway, AgencyService, UserService],
})
export class AgencyModule {}
