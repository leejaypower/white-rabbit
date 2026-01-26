/**
 * Signal status for Operator's presence tracking.
 * - JACKED_IN: Operative is connected and reachable
 * - JACKED_OUT: Operative is disconnected
 */
export type SignalStatus = 'JACKED_IN' | 'JACKED_OUT';

/**
 * Full connection status for client-side state machine.
 * Extends SignalStatus with call-related states.
 */
export type ConnectionStatus =
  | 'JACKED_OUT'
  | 'JACKED_IN'
  | 'RINGING'
  | 'CONNECTING'
  | 'CONNECTED';