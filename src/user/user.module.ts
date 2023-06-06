import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Userser } from './userservice.entity';
import { Question } from 'src/question/entities/question.entity';
import { Userhealth } from './userhealth.entity';
import { Comment } from 'src/question/entities/comment.entity';
import { Useraction } from './useraction.entity';
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
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
