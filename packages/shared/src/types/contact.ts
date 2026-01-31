import type { ConnectionStatus } from './status';

/**
 * Contact stored locally on client.
 * Server does not store contact lists.
 */
export interface Contact {
  /** Terminal ID (primary key, unique, immutable) */
  terminalId: string;
  /** User-defined display name (editable) */
  name: string;
  /** Current connection status */
  status: ConnectionStatus;
  /** Unix timestamp when contact was added */
  addedAt: number;
  /** Unix timestamp of last seen online */
  lastSeenAt?: number;
}