import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WsEvent, JackInPayload, SignalPayload } from '@white-rabbit/shared';
import { LinkStore } from './link.store';
import { AccessCodeService } from '../access-code/access-code.service';

/**
 * Handles operative jack-in / jack-out and broadcasts presence signals.
 */
@Injectable()
export class SignalService {
  constructor(
    private readonly linkStore: LinkStore,
    private readonly accessCodeService: AccessCodeService,
  ) {}

  /** Register operative link and broadcast JACKED_IN signal */
  async jackIn(client: WebSocket, payload: JackInPayload): Promise<void> {
    const result = await this.accessCodeService.validate(payload);
    if (!result.valid) {
      client.send(
        JSON.stringify({
          event: WsEvent.ERROR,
          data: { reason: result.reason },
        }),
      );
      return;
    }

    const { terminalId } = payload;
    this.linkStore.register(terminalId, client);
    console.log(`📡 Terminal "${terminalId}" jacked in`);
    this.broadcast({ terminalId, status: 'JACKED_IN' });
  }

  /** Remove operative link and broadcast JACKED_OUT signal */
  jackOut(client: WebSocket): void {
    const terminalId = this.linkStore.unregister(client);
    if (terminalId) {
      console.log(`📡 Terminal "${terminalId}" jacked out`);
      this.broadcast({ terminalId, status: 'JACKED_OUT' });
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
