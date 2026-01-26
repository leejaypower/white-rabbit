import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { WebSocket } from 'ws';

const PULSE_INTERVAL = 30_000; // 30 seconds
const CONNECTION_TIMEOUT = 60_000; // 60 seconds

interface ClientState {
  lastPulse: number;
}

@Injectable()
export class PulseService implements OnModuleDestroy {
  private clients = new Map<WebSocket, ClientState>();
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.startPulseCheck();
  }

  onModuleDestroy() {
    this.stopPulseCheck();
  }

  /** Register new client connection */
  register(client: WebSocket) {
    this.clients.set(client, { lastPulse: Date.now() });
  }

  /** Unregister client on disconnect */
  unregister(client: WebSocket) {
    this.clients.delete(client);
  }

  /** Refresh client's last pulse timestamp */
  refresh(client: WebSocket) {
    const state = this.clients.get(client);
    if (state) {
      state.lastPulse = Date.now();
    }
  }

  /** Start periodic pulse check */
  private startPulseCheck() {
    this.intervalId = setInterval(() => {
      const now = Date.now();

      for (const [client, state] of this.clients) {
        if (now - state.lastPulse > CONNECTION_TIMEOUT) {
          console.log('⏰ Operative timed out, closing connection');
          client.close();
          this.clients.delete(client);
        }
      }
    }, PULSE_INTERVAL);
  }

  /** Stop pulse check on shutdown */
  private stopPulseCheck() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}