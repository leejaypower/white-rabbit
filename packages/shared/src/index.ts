export type ConnectionStatus =
  | 'OFFLINE'
  | 'ONLINE'
  | 'RINGING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'BUSY';

export interface Contact {
  id: string;
  name: string;
  fingerprint: string;
  status: ConnectionStatus;
}
