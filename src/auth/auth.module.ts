import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.auth';
import { User } from '../user/user.entity';
import { Userser } from '../user/userservice.entity';
import { Question } from 'src/question/entities/question.entity';
import { Comment } from 'src/question/entities/comment.entity';
import { Useraction } from 'src/user/useraction.entity';
import { Userhealth } from 'src/user/userhealth.entity';
import { JwtStrategy } from './jwt.auth';
@Module({
  imports: [
    JwtModule.register({
      secret: 'test123456',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([
      User,
      Userser,
      Question,
      Userhealth,
      Comment,
      Useraction,
    ]),
  ],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
