import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { PulseService } from './pulse.service';

@Module({
  providers: [WsGateway, PulseService],
  exports: [WsGateway],
})
export class WsModule {}