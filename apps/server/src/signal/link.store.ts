import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

/**
 * In-memory store mapping terminal IDs to WebSocket connections bidirectionally.
 */
@Injectable()
export class LinkStore {
  private terminalToClient = new Map<string, WebSocket>();
  private clientToTerminal = new Map<WebSocket, string>();

  /** Register terminalId ↔ client link when an operative jacks in */
  register(terminalId: string, client: WebSocket): void {
    this.terminalToClient.set(terminalId, client);
    this.clientToTerminal.set(client, terminalId);
  }

  /** Remove link when an operative disconnects. Returns the removed terminalId */
  unregister(client: WebSocket): string | undefined {
    const terminalId = this.clientToTerminal.get(client);
    if (terminalId) {
      this.terminalToClient.delete(terminalId);
      this.clientToTerminal.delete(client);
    }
    return terminalId;
  }

  /** Look up an operative's WebSocket by terminalId */
  getClient(terminalId: string): WebSocket | undefined {
    return this.terminalToClient.get(terminalId);
  }

  /** Look up an operative's terminalId by WebSocket */
  getTerminalId(client: WebSocket): string | undefined {
    return this.clientToTerminal.get(client);
  }

  /** Get all connected operative WebSockets for broadcasting */
  getAllClients(): WebSocket[] {
    return Array.from(this.terminalToClient.values());
  }
}
