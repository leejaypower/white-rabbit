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
import { SignalService } from '../signal/signal.service';
import { JackInPayload } from '@white-rabbit/shared';

@WebSocketGateway()
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly pulseService: PulseService,
    private readonly signalService: SignalService,
  ) {}

  afterInit() {
    console.log('🔌 WebSocket Gateway initialized');
  }

  handleConnection(client: WebSocket) {
    console.log('⚡ Client connected');
    this.pulseService.register(client);
  }

  handleDisconnect(client: WebSocket) {
    console.log('💔 Client disconnected');
    this.signalService.jackOut(client);
    this.pulseService.unregister(client);
  }

  @SubscribeMessage(WsEvent.JACK_IN)
  handleJackIn(client: WebSocket, data: JackInPayload) {
    this.signalService.jackIn(client, data);
  }

  @SubscribeMessage(WsEvent.PULSE)
  handlePulse(client: WebSocket) {
    this.pulseService.refresh(client);
    return { event: WsEvent.PULSE, data: {} };
  }
}