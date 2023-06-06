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
import { UserService } from 'src/user/user.service';

@Controller('manage')
@WebSocketGateway(7000, {
  transports: ['websocket'],
})
export class AgencyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly userService: UserService) {}
  private logger: Logger = new Logger('AgencyGateway');
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    this.logger.log('Initialized!');
    this.logger.log(server);
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client}`);
    // this.logger.log(JSON.stringify(client));
    // this.clients.add(client);
    this.logger.log(args);
    // for (const i in client) {
    //   console.log(i);
    // }
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getservicelist')
  async onMessage() {
    return await this.userService.getServiceAll();
  }
}
