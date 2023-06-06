import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { RabbitMQService } from './ws.service';
import { Logger, Controller } from '@nestjs/common';
import { Server } from 'socket.io';
import { Message } from './message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';

@Controller('chat')
@WebSocketGateway(4000, {
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway');
  @WebSocketServer() server: Server;
  private readonly clients = new Map<any, string>();
  private readonly offlineUser = new Set<string>();

  constructor(
    private readonly wsService: RabbitMQService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  afterInit(server: any) {
    this.logger.log('Initialized!');
    this.logger.log(server);
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client}`);
    this.logger.log(args);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = this.clients.get(client);
    this.clients.delete(client);
    this.offlineUser.add(user);
  }

  @SubscribeMessage('message')
  async onMessage(client: any, message: Message) {
    const { content } = message;
    console.log(message);
    if (content.type === 'pre') {
      //Content.msg是用户id
      await this.wsService.createQueueAndBind(content.msg);
      this.clients.set(client, content.msg);
      this.offlineUser.delete(content.msg);
      const queueName = `chatroom_${content.msg}`;
      try {
        // 获取离线消息，根据用户消息队列
        let offlineMessages = await this.wsService.getOfflineMessages(
          queueName,
          content.msg,
        );
        offlineMessages = offlineMessages.map((value) => JSON.parse(value));
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        //寻找聊天室中的所有用户
        queryBuilder
          .where(
            `user.openid IN (SELECT openid FROM userqueue WHERE roomid = :roomid)`,
          )
          .setParameter('roomid', 'chatroom');
        const users = await queryBuilder.getMany();
        // 将离线消息发送给客户端
        offlineMessages = offlineMessages.map((value) => {
          const sender = value.content.sender;
          const user = users.find((v) => v.openid === sender);
          if (user) {
            value['avatar'] = user.avatar;
            value['username'] = user.username;
          }
          return value;
        });
        return {
          code: 200,
          errMsg: 'prefetch done.',
          users,
          message: offlineMessages,
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        // return { code: 500, errMsg: 'Error fetching users' };
      }
    } else {
      //content是发送的信息对象,msg内容取决于type取值
      console.log('---Online---');
      for (const [c, userId] of this.clients) {
        this.logger.log(userId);
        if (c !== client) {
          // return message;
          c.send(JSON.stringify(message));
        }
      }
      console.log('---Offline---');
      for (const userId of this.offlineUser) {
        console.log(`chatroom_${userId}`);
        await this.wsService.publishToQueue(
          `chatroom_${userId}`,
          JSON.stringify(message),
        );
      }
    }
  }
}
