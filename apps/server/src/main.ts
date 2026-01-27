import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🐇 White Rabbit Operator running on port ${port}`);
}

bootstrap();