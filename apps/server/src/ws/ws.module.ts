import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { PulseService } from './pulse.service';
import { SignalModule } from '../signal/signal.module';

@Module({
  imports: [SignalModule],
  providers: [WsGateway, PulseService],
  exports: [WsGateway],
})
export class WsModule {}