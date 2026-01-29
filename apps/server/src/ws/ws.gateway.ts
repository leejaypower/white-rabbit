import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage, ConnectedSocket, MessageBody,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import {
  WsEvent,
  JackInPayload,
  RingPayload,
  PatchThroughPayload,
  DisconnectPayload,
  HardlinePayload,
  JackOutPayload,
} from '@white-rabbit/shared';
import { PulseService } from './pulse.service';
import { SignalService } from '../signal/signal.service';
import { HardlineService } from '../hardline/hardline.service';

@WebSocketGateway()
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly pulseService: PulseService,
    private readonly signalService: SignalService,
    private readonly hardlineService: HardlineService,
  ) {}

  afterInit() {
    console.log('🔌 WebSocket Gateway initialized');
  }

  handleConnection(@ConnectedSocket() client: WebSocket) {
    console.log('⚡ Client connected');
    this.pulseService.register(client);
  }

  handleDisconnect(@ConnectedSocket() client: WebSocket) {
    console.log('💔 Client disconnected');
    this.signalService.jackOut(client);
    this.pulseService.unregister(client);
  }

  @SubscribeMessage(WsEvent.JACK_IN)
  handleJackIn(@ConnectedSocket() client: WebSocket, @MessageBody() data: JackInPayload) {
    this.signalService.jackIn(client, data);
  }

  @SubscribeMessage(WsEvent.RING)
  handleRing(@ConnectedSocket() client: WebSocket, @MessageBody() data: RingPayload) {
    this.hardlineService.ring(client, data);
  }

  @SubscribeMessage(WsEvent.PATCH_THROUGH)
  handlePatchThrough(@ConnectedSocket() client: WebSocket, @MessageBody() data: PatchThroughPayload) {
    this.hardlineService.patchThrough(client, data);
  }

  @SubscribeMessage(WsEvent.DISCONNECT)
  handleReject(@ConnectedSocket() client: WebSocket, @MessageBody() data: DisconnectPayload) {
    this.hardlineService.disconnect(client, data);
  }

  @SubscribeMessage(WsEvent.HARDLINE)
  handleHardline(@ConnectedSocket() client: WebSocket, @MessageBody() data: HardlinePayload) {
    this.hardlineService.relay(client, data);
  }

  @SubscribeMessage(WsEvent.JACK_OUT)
  handleJackOut(@ConnectedSocket() client: WebSocket, @MessageBody() data: JackOutPayload) {
    this.hardlineService.jackOut(client, data);
  }

  @SubscribeMessage(WsEvent.PULSE)
  handlePulse(@ConnectedSocket() client: WebSocket) {
    this.pulseService.refresh(client);
    return { event: WsEvent.PULSE, data: {} };
  }
}