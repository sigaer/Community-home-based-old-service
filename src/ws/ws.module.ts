import { Module } from '@nestjs/common';
// import { SocketIoModule } from '@nestjs/platform-socket.io';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ChatGateway } from './ws.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQService } from './ws.service';
import { Userqueue } from './userqueue.entity';
import { User } from '../user/user.entity';
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://localhost:5672',
      exchanges: [
        {
          name: 'chat_exchange',
          type: 'topic',
        },
      ],
    }),
    TypeOrmModule.forFeature([Userqueue, User]),
  ],
  controllers: [],
  providers: [ChatGateway, RabbitMQService],
})
export class WsModule {}
