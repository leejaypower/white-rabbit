import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { WsEvent } from '@white-rabbit/shared';
import { PulseService } from './pulse.service';

@WebSocketGateway()
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private readonly pulseService: PulseService) {}

  afterInit() {
    console.log('🔌 WebSocket Gateway initialized');
  }

  handleConnection(client: WebSocket) {
    console.log('⚡ Operative connected');
    this.pulseService.register(client);
  }

  handleDisconnect(client: WebSocket) {
    console.log('💔 Operative disconnected');
    this.pulseService.unregister(client);
  }

  @SubscribeMessage(WsEvent.PULSE)
  handlePulse(client: WebSocket) {
    this.pulseService.refresh(client);
    return { event: WsEvent.PULSE, data: {} };
  }
}