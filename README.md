# White Rabbit

**Session-only, peer-to-peer terminal communication. No history.**

White Rabbit is a terminal-based intercom for ephemeral, one-to-one communication.
Connections exist only while both peers are present.
Nothing is stored. Nothing is synced. Nothing remains.

Follow the signal.

---

## Philosophy

- This is not a messenger.
- This is not a chat history.
- This is a live session between two peers.

When the session ends, everything disappears.

---

## Core Principles

- **Session-only**: Messages exist only during an active connection.
- **Peer-to-peer**: Direct communication via WebRTC.
- **No history**: No local or server-side message storage.
- **Terminal-first**: Keyboard-only, full-screen TUI.
- **Minimal trust**: The server remembers nothing.

---

## What This Is (and Isn't)

### ✅ This is
- A terminal intercom
- A presence-based communication tool
- A tool for developers and terminal users

### ❌ This is not
- A messenger app
- A cloud-synced service
- A platform with accounts or profiles

---

## Architecture (High-level)

- **Client**: Terminal UI (TUI), session state machine, WebRTC peer
- **Server**: Signaling, presence, and license activation only
- **Storage**: None (session memory only)

All messages are transmitted peer-to-peer and discarded immediately after the session ends.

---

## Status

🚧 **Work in progress**

This repository is under active development.
APIs, UX, and internal structure may change.

---

## License

See [LICENSE](./LICENSE) for details.
