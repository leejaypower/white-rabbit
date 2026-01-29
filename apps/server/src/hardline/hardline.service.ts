import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import {
  WsEvent,
  RingPayload,
  PatchThroughPayload,
  DisconnectPayload,
  HardlinePayload,
  JackOutPayload,
} from '@white-rabbit/shared';
import { LinkStore } from '../signal/link.store';

@Injectable()
export class HardlineService {
  constructor(private readonly linkStore: LinkStore) {}

  ring(client: WebSocket, payload: RingPayload): void {
    const callerTerminalId = this.linkStore.getTerminalId(client);
    if (!callerTerminalId) return;

    const target = this.linkStore.getClient(payload.targetTerminalId);
    if (!target || target.readyState !== WebSocket.OPEN) return;

    target.send(
      JSON.stringify({ event: WsEvent.INCOMING, data: { callerTerminalId } }),
    );
  }

  patchThrough(client: WebSocket, payload: PatchThroughPayload): void {
    const calleeTerminalId = this.linkStore.getTerminalId(client);
    if (!calleeTerminalId) return;

    const target = this.linkStore.getClient(payload.callerTerminalId);
    if (!target || target.readyState !== WebSocket.OPEN) return;

    target.send(
      JSON.stringify({
        event: WsEvent.PATCH_THROUGH,
        data: { calleeTerminalId },
      }),
    );
  }

  disconnect(client: WebSocket, payload: DisconnectPayload): void {
    const calleeTerminalId = this.linkStore.getTerminalId(client);
    if (!calleeTerminalId) return;

    const target = this.linkStore.getClient(payload.callerTerminalId);
    if (!target || target.readyState !== WebSocket.OPEN) return;

    target.send(
      JSON.stringify({
        event: WsEvent.DISCONNECT,
        data: { calleeTerminalId },
      }),
    );
  }

  relay(client: WebSocket, payload: HardlinePayload): void {
    const senderTerminalId = this.linkStore.getTerminalId(client);
    if (!senderTerminalId) return;

    const target = this.linkStore.getClient(payload.targetTerminalId);
    if (!target || target.readyState !== WebSocket.OPEN) return;

    target.send(
      JSON.stringify({
        event: WsEvent.HARDLINE,
        data: { targetTerminalId: senderTerminalId, data: payload.data },
      }),
    );
  }

  jackOut(client: WebSocket, payload: JackOutPayload): void {
    const senderTerminalId = this.linkStore.getTerminalId(client);
    if (!senderTerminalId) return;

    const target = this.linkStore.getClient(payload.targetTerminalId);
    if (!target || target.readyState !== WebSocket.OPEN) return;

    target.send(
      JSON.stringify({
        event: WsEvent.JACK_OUT,
        data: { targetTerminalId: senderTerminalId },
      }),
    );
  }
}
