import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HealthController } from './health/health.controller';
import { WsModule } from './ws/ws.module';
import { SignalModule } from './signal/signal.module';
import { HardlineModule } from './hardline/hardline.module';
import { AccessCodeModule } from './access-code/access-code.module';
import config from './mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(config),
    WsModule,
    SignalModule,
    HardlineModule,
    AccessCodeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}