import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WsEvent, JackInPayload, SignalPayload } from '@white-rabbit/shared';
import { LinkStore } from './link.store';

/**
 * Handles operative jack-in / jack-out and broadcasts presence signals.
 */
@Injectable()
export class SignalService {
  constructor(private readonly linkStore: LinkStore) {}

  /** Register operative link and broadcast JACKED_IN signal */
  jackIn(client: WebSocket, payload: JackInPayload): void {
    const { handle } = payload;
    this.linkStore.register(handle, client);
    console.log(`📡 Operative "${handle}" jacked in`);
    this.broadcast({ handle, status: 'JACKED_IN' });
  }

  /** Remove operative link and broadcast JACKED_OUT signal */
  jackOut(client: WebSocket): void {
    const handle = this.linkStore.unregister(client);
    if (handle) {
      console.log(`📡 Operative "${handle}" jacked out`);
      this.broadcast({ handle, status: 'JACKED_OUT' });
    }
  }

  /** Send signal to all connected operatives */
  private broadcast(data: SignalPayload): void {
    const message = JSON.stringify({ event: WsEvent.SIGNAL, data });
    for (const client of this.linkStore.getAllClients()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}
