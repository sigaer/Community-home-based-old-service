import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WsModule } from './ws/ws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { QuestionModule } from './question/question.module';
import { CheckModule } from './check/check.module';
import { AnnoModule } from './anno/anno.module';
import { ComplainModule } from './complain/complain.module';
import { FeedbackModule } from './feedback/feedback.module';
import { SystemModule } from './system/system.module';
import { AgencyModule } from './agency/agency.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'wtf025366',
      database: 'community',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // logging: true,
    }),
    AuthModule,
    UserModule,
    PassportModule,
    WsModule,
    QuestionModule,
    CheckModule,
    AnnoModule,
    ComplainModule,
    FeedbackModule,
    SystemModule,
    AgencyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
