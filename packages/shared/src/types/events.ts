/**
 * WebSocket event names for Operator communication.
 */
export const WsEvent = {
  // Operative → Operator
  /** Register connection with access code */
  JACK_IN: 'jack_in',
  /** Request call to target */
  RING: 'ring',
  /** Accept incoming call */
  PATCH_THROUGH: 'patch_through',
  /** Reject incoming call */
  DISCONNECT: 'disconnect',

  // Operator → Operative
  /** Broadcast presence status update */
  SIGNAL: 'signal',
  /** Notify incoming call */
  INCOMING: 'incoming',

  // Bidirectional
  /** WebRTC signaling (SDP/ICE) */
  HARDLINE: 'hardline',
  /** End call / disconnect session */
  JACK_OUT: 'jack_out',
  /** Heartbeat for connection keep-alive */
  PULSE: 'pulse',
  /** Error response */
  ERROR: 'error',
} as const;

export type WsEventType = (typeof WsEvent)[keyof typeof WsEvent];