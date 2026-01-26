import type { ConnectionStatus } from './status';

/**
 * Contact stored locally on client.
 * Server does not store contact lists.
 */
export interface Contact {
  /** Local unique identifier */
  id: string;
  /** User-defined display name (editable) */
  name: string;
  /** Public identifier for P2P connection */
  handle: string;
  /** Current connection status */
  status: ConnectionStatus;
}