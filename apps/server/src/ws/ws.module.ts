import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { PulseService } from './pulse.service';
import { SignalModule } from '../signal/signal.module';
import { HardlineModule } from '../hardline/hardline.module';

@Module({
  imports: [SignalModule, HardlineModule],
  providers: [WsGateway, PulseService],
  exports: [WsGateway],
})
export class WsModule {}