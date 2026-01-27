import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

/**
 * In-memory store mapping operative handles to WebSocket connections bidirectionally.
 */
@Injectable()
export class LinkStore {
  private handleToClient = new Map<string, WebSocket>();
  private clientToHandle = new Map<WebSocket, string>();

  /** Register handle ↔ client link when an operative jacks in */
  register(handle: string, client: WebSocket): void {
    this.handleToClient.set(handle, client);
    this.clientToHandle.set(client, handle);
  }

  /** Remove link when an operative disconnects. Returns the removed handle */
  unregister(client: WebSocket): string | undefined {
    const handle = this.clientToHandle.get(client);
    if (handle) {
      this.handleToClient.delete(handle);
      this.clientToHandle.delete(client);
    }
    return handle;
  }

  /** Look up an operative's WebSocket by handle */
  getClient(handle: string): WebSocket | undefined {
    return this.handleToClient.get(handle);
  }

  /** Look up an operative's handle by WebSocket */
  getHandle(client: WebSocket): string | undefined {
    return this.clientToHandle.get(client);
  }

  /** Get all connected operative WebSockets for broadcasting */
  getAllClients(): WebSocket[] {
    return Array.from(this.handleToClient.values());
  }
}
