import type { SignalStatus } from './status';

// ============================================
// Operative → Operator
// ============================================

/** Payload for jack_in event (register connection) */
export interface JackInPayload {
  access_code: string;
  terminal_id: string;
}

/** Payload for ring event (request call) */
export interface RingPayload {
  target_handle: string;
}

/** Payload for patch_through event (accept call) */
export interface PatchThroughPayload {
  caller_handle: string;
}

/** Payload for disconnect event (reject call) */
export interface DisconnectPayload {
  caller_handle: string;
}

// ============================================
// Operator → Operative
// ============================================

/** Payload for signal event (presence broadcast) */
export interface SignalPayload {
  terminal_id: string;
  status: SignalStatus;
}

/** Payload for incoming event (incoming call notification) */
export interface IncomingPayload {
  caller_handle: string;
}

// ============================================
// Bidirectional
// ============================================

/** Payload for hardline event (WebRTC signaling) */
export interface HardlinePayload {
  target_handle: string;
  /** SDP offer/answer or ICE candidate */
  data: unknown;
}

/** Payload for jack_out event (end call) */
export interface JackOutPayload {
  target_handle: string;
}

/** Payload for pulse event (heartbeat) */
export interface PulsePayload {}