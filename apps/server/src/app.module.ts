import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { WsModule } from './ws/ws.module';
import { SignalModule } from './signal/signal.module';

@Module({
  imports: [WsModule, SignalModule],
  controllers: [HealthController],
})
export class AppModule {}