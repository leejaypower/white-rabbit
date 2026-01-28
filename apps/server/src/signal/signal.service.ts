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
    const { terminal_id } = payload;
    this.linkStore.register(terminal_id, client);
    console.log(`📡 Terminal "${terminal_id}" jacked in`);
    this.broadcast({ terminal_id, status: 'JACKED_IN' });
  }

  /** Remove operative link and broadcast JACKED_OUT signal */
  jackOut(client: WebSocket): void {
    const terminalId = this.linkStore.unregister(client);
    if (terminalId) {
      console.log(`📡 Terminal "${terminalId}" jacked out`);
      this.broadcast({ terminal_id: terminalId, status: 'JACKED_OUT' });
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
