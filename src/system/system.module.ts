import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemGateway } from './system.gateway';

@Module({
  providers: [SystemGateway, SystemService],
})
export class SystemModule {}
