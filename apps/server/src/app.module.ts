import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { WsModule } from './ws/ws.module';
import { SignalModule } from './signal/signal.module';
import { HardlineModule } from './hardline/hardline.module';

@Module({
  imports: [WsModule, SignalModule, HardlineModule],
  controllers: [HealthController],
})
export class AppModule {}