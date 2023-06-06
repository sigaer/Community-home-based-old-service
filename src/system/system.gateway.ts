import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, Controller } from '@nestjs/common';
import { Server } from 'socket.io';
import * as os from 'os';
import * as diskinfo from 'diskinfo';

@Controller('system')
@WebSocketGateway(5000, {
  transports: ['websocket'],
})
export class SystemGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('SystemGateway');
  @WebSocketServer() server: Server;

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
  }

  @SubscribeMessage('getstatus')
  async onMessage() {
    // 获取CPU利用率 只在Linux环境下有效
    const cpuUsage = Math.round(
      (os.loadavg().reduce((a, b) => a + b) * 100) / 3,
    );
    console.log('CPU利用率:', cpuUsage);
    // 获取内存信息
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    console.log('总内存:', totalMemory);
    console.log('可用内存:', freeMemory);
    console.log('已使用内存:', usedMemory);
    const disk = await new Promise((resolve) => {
      diskinfo.getDrives((err: any, aDrives: Array<any>) => {
        // 筛选根目录，Linux下根目录为/
        const root = aDrives.find((v) => v.mounted == '/');
        console.log('磁盘：' + root.mounted);
        console.log('磁盘总内存：' + root.blocks);
        console.log('磁盘已用内存：' + root.used);
        console.log('磁盘可用内存：' + root.available);
        console.log('磁盘已用内存百分比： ' + root.capacity);
        console.log('-----------------------------------------');
        resolve({ total: root.blocks, used: root.used });
      });
    });
    return {
      memory: {
        totalMemory,
        freeMemory,
      },
      cpuUsage,
      disk,
    };
  }
}
