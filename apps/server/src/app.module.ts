import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { HealthController } from './health/health.controller';
import { WsModule } from './ws/ws.module';
import { SignalModule } from './signal/signal.module';
import { HardlineModule } from './hardline/hardline.module';
import { AccessCodeModule } from './access-code/access-code.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: PostgreSqlDriver,
        clientUrl: configService.get<string>('DATABASE_URL'),
        entities: ['./dist/**/*.entity.js'],
        entitiesTs: ['./src/**/*.entity.ts'],
        extensions: [Migrator],
        migrations: { path: './src/migrations' },
      }),
    }),
    WsModule,
    SignalModule,
    HardlineModule,
    AccessCodeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}