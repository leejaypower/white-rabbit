import type { SignalStatus } from './status';

// ============================================
// Operative → Operator
// ============================================

/** Payload for jack_in event (register connection) */
export interface JackInPayload {
  accessCode: string;
  terminalId: string;
}

/** Payload for ring event (request call) */
export interface RingPayload {
  targetTerminalId: string;
}

/** Payload for patch_through event (accept call) */
export interface PatchThroughPayload {
  callerTerminalId: string;
}

/** Payload for disconnect event (reject call) */
export interface DisconnectPayload {
  callerTerminalId: string;
}

// ============================================
// Operator → Operative
// ============================================

/** Payload for signal event (presence broadcast) */
export interface SignalPayload {
  terminalId: string;
  status: SignalStatus;
}

/** Payload for incoming event (incoming call notification) */
export interface IncomingPayload {
  callerTerminalId: string;
}

// ============================================
// Bidirectional
// ============================================

/** Payload for hardline event (WebRTC signaling) */
export interface HardlinePayload {
  targetTerminalId: string;
  /** SDP offer/answer or ICE candidate */
  data: unknown;
}

/** Payload for jack_out event (end call) */
export interface JackOutPayload {
  targetTerminalId: string;
}

/** Payload for pulse event (heartbeat) */
export interface PulsePayload {}