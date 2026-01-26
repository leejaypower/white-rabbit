import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [HealthController],
})
export class AppModule {}