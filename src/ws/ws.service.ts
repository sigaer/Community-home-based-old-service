// rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Userqueue } from './userqueue.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Map<string, Channel>;

  constructor(
    @InjectRepository(Userqueue)
    private readonly userqueueRepository: Repository<Userqueue>,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  async connect(userId: string) {
    if (!this.connection) {
      this.connection = await connect('amqp://localhost:5672');
    }

    if (!this.channel) {
      this.channel = new Map();
    }

    if (!this.channel.has(userId)) {
      this.channel.set(userId, await this.connection.createChannel());
    }
  }

  async publishToQueue(queueName: string, message: any) {
    // async publishToQueue(queueName: string, message: any) {
    try {
      // 将消息发送到指定队列
      this.amqpConnection.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );
    } catch (error) {
      console.error('Error publishing message to queue:', error);
    }
  }
  // 获取离线信息
  async getOfflineMessages(queueName: string, userId: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const messages: any[] = [];
      const userChannel = this.channel.get(userId);

      try {
        await userChannel.assertQueue(queueName, {
          durable: true,
        });

        const consumerTag = `consumer_${userId}`;
        const consumer = (msg) => {
          if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());
            messages.push(messageContent);
            userChannel.ack(msg);
          } else {
            resolve(messages);
          }
        };

        // 使用 { noAck: false } 选项来确认消息已被处理
        userChannel.consume(queueName, consumer, {
          noAck: false,
          consumerTag: consumerTag,
        });

        // 等待一段时间，确保所有消息都被处理
        setTimeout(async () => {
          // 取消消费者
          await userChannel.cancel(consumerTag);
          resolve(messages);
        }, 1000);
      } catch (error) {
        console.error('Error fetching offline messages:', error);
        reject(error);
      }
    });
  }

  async createQueueAndBind(userId: string) {
    await this.connect(userId);
    const queue = `chatroom_${userId}`;
    const routingkey = `chatroom`;
    const userqueue = await this.userqueueRepository.findOneBy({
      roomid: routingkey,
      openid: userId,
    });

    if (!userqueue) {
      const userChannel = this.channel.get(userId);
      //确保队列存在
      await userChannel.assertQueue(queue, { durable: true });
      await userChannel.bindQueue(queue, 'chat_exchange', routingkey);
      const userQueue = new Userqueue();
      userQueue.openid = userId;
      userQueue.roomid = routingkey;
      userQueue.queuename = queue;
      await this.userqueueRepository.save(userQueue);
    }
  }
}
