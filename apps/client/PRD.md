# White Rabbit - Operative PRD

## 제품 정의

White Rabbit Operative는 터미널에서 동작하는 1:1 세션 전용 P2P 통신 클라이언트이다. 메시지는 서버와 로컬 어디에도 저장되지 않으며, 연결된 세션 동안에만 존재한다.

Operative는 Operator를 통해 다른 Operative와 연결되지만, 실제 메시지는 P2P 채널을 통해서만 전송된다.

> *"Operative는 기억하지 않는다. 연결된 순간에만 존재한다."*

---

## 핵심 컨셉

- **메신저가 아닌 전화/인터컴 모델**: 연결 중일 때만 통신 가능
- **Ephemeral by Design**: 세션 종료 시 모든 히스토리 즉시 폐기
- **Privacy First**: 연락처만 로컬 저장, 메시지는 절대 저장 안 함
- **Terminal Native**: 키보드 전용, TUI 기반 UX
- **Cyberpunk Aesthetic**: 매트릭스 모티브, 해커 감성

---

## 타겟 사용자

- 개발자, 보안/인프라 엔지니어
- 터미널/TUI 애호가
- 프라이버시를 중시하는 긱/해커 문화 사용자
- 암호화폐/블록체인 커뮤니티

---

## 플랫폼

- **macOS** (Primary)
- **Linux** (Ubuntu, Arch, Fedora)
- **Windows** (WSL 지원)

패키징:
- macOS: DMG / Homebrew
- Linux: AppImage / Snap
- Windows: Portable Executable

---

## 아키텍처

```
┌─────────────┐        WebSocket         ┌──────────────┐
│  Operative  │◄──────────────────────►  │   Operator   │
│   (Client)  │    (Signal/Hardline)     │   (Server)   │
└─────────────┘                          └──────────────┘
       ▲
       │ WebRTC P2P
       ▼
┌─────────────┐
│  Operative  │
│   (Peer)    │
└─────────────┘
```

### 통신 계층

1. **Operator Link (WebSocket)**: Signaling, Presence
2. **Hardline (WebRTC)**: P2P 메시지 전송
3. **Local Store (SQLite)**: 연락처, 설정, 키 저장

---

## 라이선스 (Access Code)

### 활성화 프로세스

```
1. 사용자가 Access Code 입력
2. Terminal ID (공개키) 생성
3. Operator에 jack_in 요청
4. 검증 성공 → 로컬에 키 저장
5. 이후 자동 재연결
```

### Terminal ID

- Ed25519 키쌍 생성
- 공개키가 Terminal ID (`ed25519:abc123...`)
- 개인키는 로컬에만 저장 (`~/.whiterabbit/keys/`)
- Operator는 공개키만 알고 있음
- 1 Access Code = 1 Terminal ID (디바이스 바인딩)

### 재활성화

- 새 기기에서 사용 시 기존 바인딩 해제 필요
- 웹 대시보드에서 "Transfer License" 수행
- 기존 Operative는 자동 jack_out

---

## 연락처 관리

### 등록 방식

**Add by Handle**
```bash
$ rabbit add <handle> [name]
✓ Contact added: Alice
```

- Terminal ID를 직접 입력하여 연락처 추가
- 이름은 선택 사항 (나중에 변경 가능)
- 단방향 추가 (상대방은 별도로 추가 필요)
- Terminal ID는 외부 채널(문자, 카톡 등)로 공유

### 로컬 저장

```typescript
interface Contact {
  id: string;           // UUID
  name: string;         // 사용자 지정 이름 (변경 가능)
  handle: string;       // Terminal ID (변경 불가)
  status: ConnectionStatus;
  addedAt: number;
  lastSeenAt?: number;
}
```

### 연락처 작업

- **이름 변경**: `r` 키 또는 `rabbit rename <name>`
- **삭제**: `rabbit remove <name>`
- **목록**: `rabbit list`
- **상태**: 실시간 Signal 업데이트

---

## 상태 모델 (Connection Status)

### 상태 정의

| 상태 | 설명 | UI 표시 |
|------|------|---------|
| `JACKED_OUT` | 오프라인 | `○ JACKED OUT` (dim) |
| `JACKED_IN` | 온라인, 대기 중 | `● JACKED IN` (green) |
| `RINGING` | 발신 중 | `◉ RINGING...` (yellow, blink) |
| `CONNECTING` | 연결 수립 중 | `◉ CONNECTING...` (yellow) |
| `CONNECTED` | 통화 중 | `● CONNECTED` (cyan) |

### 상태 전환

```
         jack_in
JACKED_OUT ────────► JACKED_IN
    ▲                   │
    │                   │ ring (outgoing)
    │                   ▼
    │               RINGING
    │                   │
    │                   │ patch_through (accept)
    │                   ▼
    │               CONNECTING
    │                   │
    │                   │ WebRTC established
    │                   ▼
    └───────────────CONNECTED
         jack_out / disconnect
```

### Busy 처리

- `CONNECTED` 상태에서 다른 ring 수신 → 자동 거절, `BUSY` 응답
- 상대방에게 "Operative is busy" 표시

---

## 화면 구성 (TUI Screens)

### 1. Init Screen (최초 실행)

```
┌─────────────────────────────────────────────┐
│                                             │
│          ██     ██ ██████                  │
│          ██     ██ ██   ██                 │
│          ██  █  ██ ██████                  │
│          ██ ███ ██ ██   ██                 │
│           ███ ███  ██   ██                 │
│                                             │
│          WHITE RABBIT                       │
│          Operative Terminal                 │
│                                             │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │ Access Code: ___________________  │    │
│   └───────────────────────────────────┘    │
│                                             │
│   Enter your access code to activate.      │
│                                             │
└─────────────────────────────────────────────┘
```

**상태**: 아직 활성화되지 않은 상태 (최초 실행)  
**입력**: Access Code 입력  
**동작**: 
- Enter 입력 시 Operator에 jack_in 시도
- 성공 → Terminal ID 생성 및 저장 → Main Screen 이동
- 실패 → 에러 메시지 표시

---

### 2. Loading Screen (이후 실행 시)

```
┌─────────────────────────────────────────────┐
│                                             │
│          ██     ██ ██████                  │
│          ██     ██ ██   ██                 │
│          ██  █  ██ ██████                  │
│          ██ ███ ██ ██   ██                 │
│           ███ ███  ██   ██                 │
│                                             │
│          WHITE RABBIT                       │
│          Operative Terminal                 │
│                                             │
│                                             │
│                                             │
│          Wake up, Jay...                    │
│          Follow the white rabbit.           │
│                                             │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

**상태**: Access Code 검증 중 (이후 실행)  
**표시**: 
- Terminal ID로 자동 jack_in 시도
- "Jay" 부분은 사용자 이름/별칭으로 동적 변경 가능
- 검증 중 메시지 표시 (0.5~1초)

**동작**:
- 로컬에 저장된 Access Code & Terminal ID로 자동 인증
- 성공 → Main Screen 이동
- 실패 → Init Screen으로 돌아가 재입력 요청

---

### 3. Main Screen (대기 화면)

```
┌─────────────────────────────────────────────┐
│ ● WHITE RABBIT              [JACKED IN]     │
├─────────────────────────────────────────────┤
│                                             │
│  Contacts (3)                               │
│                                             │
│  ▸ ● Alice                    [JACKED IN]   │
│    ○ Bob                     [JACKED OUT]   │
│    ○ Carol                   [JACKED OUT]   │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ ↑↓: Select  Enter: Connect  R: Rename       │
│ A: Add  D: Delete  Esc: Quit                │
└─────────────────────────────────────────────┘
```

**상태**: JACKED_IN, 연결 대기 중  
**표시 요소**:
- 상단: 본인 상태 (JACKED_IN/OUT)
- 연락처 목록: 이름 + 실시간 상태
- 하단: 키보드 단축키

**키 바인딩**:
- `↑`/`↓`: 연락처 선택
- `Enter`: 선택한 연락처에 연결 요청
- `a`: 연락처 추가
- `r`: 이름 변경 모드
- `d`: 연락처 삭제
- `Esc`: 앱 종료

---

### 3. Ringing Screen (발신 중)

```
┌─────────────────────────────────────────────┐
│ ◉ WHITE RABBIT              [RINGING...]    │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│                                             │
│              Calling Alice...               │
│                                             │
│                  ◉◉◉                        │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ Waiting for response...                     │
│ Esc: Cancel                                 │
└─────────────────────────────────────────────┘
```

**상태**: RINGING (발신 중)  
**동작**:
- 30초 타임아웃
- 상대방이 수락 → CONNECTING → CONNECTED
- 상대방이 거절 → "Call rejected" → Main Screen
- 타임아웃 → "No response" → Main Screen

---

### 4. Incoming Screen (수신 중)

#### 4-1. 저장된 연락처

```
┌─────────────────────────────────────────────┐
│ ◉ WHITE RABBIT           [INCOMING CALL]    │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│          Knock, knock, Jay.                 │
│                                             │
│           Incoming call from                │
│                                             │
│                  Alice                      │
│                                             │
│            ed25519:a3f7b2...                │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ Enter: Accept      Esc: Reject              │
└─────────────────────────────────────────────┘
```

#### 4-2. UNKNOWN (미저장 연락처)

```
┌─────────────────────────────────────────────┐
│ ◉ WHITE RABBIT           [INCOMING CALL]    │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│          Knock, knock, Jay.                 │
│                                             │
│           Incoming call from                │
│                                             │
│                 UNKNOWN                     │
│                                             │
│            ed25519:x9k2j4...                │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ Enter: Accept      Esc: Reject              │
└─────────────────────────────────────────────┘
```

**상태**: 수신 대기  
**표시**:
- 상단: "Knock, knock, Jay." (Jay는 사용자 이름/별칭)
- 저장된 연락처면 이름 표시
- 아니면 "UNKNOWN" + Handle 표시
- UNKNOWN도 수락 가능

**동작**:
- `Enter`: 수락 → CONNECTING (UNKNOWN도 수락 가능)
- `Esc`: 거절 → Main Screen
- 10초 무응답 → 자동 거절

---

### 5. Connected Screen (통화 중)

#### 5-1. 저장된 연락처와 통화 중

```
┌─────────────────────────────────────────────┐
│ ● CONNECTED TO Alice            [00:03:42]  │
├─────────────────────────────────────────────┤
│                                             │
│ Alice: Hey, how's it going?                 │
│ You: Pretty good, working on the new...     │
│ Alice: Nice! Let me know if you need help   │
│ You: Will do, thanks!                       │
│ Alice: █                                    │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ ▸ ____________________________________      │
│ Esc: Disconnect                             │
└─────────────────────────────────────────────┘
```

#### 5-2. UNKNOWN과 통화 중

```
┌─────────────────────────────────────────────┐
│ ● CONNECTED TO UNKNOWN          [00:01:23]  │
├─────────────────────────────────────────────┤
│                                             │
│ UNKNOWN: Hello?                             │
│ You: Hi, who is this?                       │
│ UNKNOWN: It's Neo                           │
│ You: Oh hey! How did you get my handle?     │
│ UNKNOWN: █                                  │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ ▸ ____________________________________      │
│ Esc: Disconnect                             │
└─────────────────────────────────────────────┘
```

**상태**: CONNECTED  
**표시 요소**:
- 상단: 연결 대상 이름 (또는 UNKNOWN) + 연결 시간 (mm:ss)
- 메시지 영역: 스크롤 가능한 메시지 히스토리
- 하단: 입력 필드

**메시지 렌더링**:
- 타이핑 효과: 한 글자씩 애니메이션
- 본인 메시지: `You: `
- 상대방 메시지: `{Name}: ` (저장된 이름) 또는 `UNKNOWN: `
- 실시간 타이핑 인디케이터: `█` (블링크)

**동작**:
- `Enter`: 메시지 전송
- `Esc`: 연결 종료 확인 다이얼로그

---

### 6. Disconnect Confirmation

```
┌─────────────────────────────────────────────┐
│ ● CONNECTED TO Alice            [00:05:17]  │
├─────────────────────────────────────────────┤
│                                             │
│ Alice: Hey, how's it going?                 │
│ You: Pretty good, working on the new...     │
│ Alice: Nice! Let me know if you need help   │
│ You: Will do, thanks!                       │
│ ┌───────────────────────────────────────┐   │
│ │                                       │   │
│ │  Disconnect from Alice?               │   │
│ │                                       │   │
│ │  All messages will be lost.           │   │
│ │                                       │   │
│ │  Enter: Confirm    Esc: Cancel        │   │
│ │                                       │   │
│ └───────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
└─────────────────────────────────────────────┘
```

**동작**:
- `Enter`: jack_out 전송 → (UNKNOWN이면 Save Contact Screen, 아니면 Main Screen), 메시지 폐기
- `Esc`: 다이얼로그 닫기, 통화 유지

---

### 7. Save Contact Screen (UNKNOWN 통화 종료 후)

```
┌─────────────────────────────────────────────┐
│ ● WHITE RABBIT              [JACKED IN]     │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│                                             │
│          Call ended with                    │
│                                             │
│          ed25519:x9k2j4...                  │
│                                             │
│          Save to contacts?                  │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │ Name: _______________________      │    │
│   └───────────────────────────────────┘    │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ Enter: Save    Esc: Skip                    │
└─────────────────────────────────────────────┘
```

**상태**: 통화 종료 후 (UNKNOWN과 통화한 경우에만 표시)  
**표시**:
- 상대방 Terminal ID (Handle)
- 이름 입력 필드

**동작**:
- 이름 입력 후 `Enter`: 연락처 저장 → Main Screen
- `Esc`: 저장하지 않고 → Main Screen
- UNKNOWN이 아닌 경우 이 화면 생략, 바로 Main Screen

**자동 표시 조건**:
- UNKNOWN caller와 통화 후 종료 시만 표시
- 저장된 연락처와 통화 후에는 이 화면 생략

---

## CLI 명령어

### `rabbit` (메인 앱)

```bash
$ rabbit
```
TUI 실행

### `rabbit activate <access-code>`

```bash
$ rabbit activate WR-A3F7B2C8-9D1E
✓ Terminal activated
✓ Terminal ID: ed25519:a3f7b2...
```

### `rabbit add <handle> [name]`

```bash
$ rabbit add ed25519:x9k2j... Alice
✓ Contact added: Alice

# 이름 없이 추가 (나중에 rename 가능)
$ rabbit add ed25519:abc123...
Enter name: Bob
✓ Contact added: Bob
```

### `rabbit list`

```bash
$ rabbit list
Contacts (3):
  ● Alice      (JACKED_IN)
  ○ Bob        (JACKED_OUT)
  ○ Carol      (JACKED_OUT)
```

### `rabbit rename <old-name> <new-name>`

```bash
$ rabbit rename Alice "Alice (Work)"
✓ Renamed
```

### `rabbit remove <name>`

```bash
$ rabbit remove Bob
✓ Contact removed
```

### `rabbit status`

```bash
$ rabbit status
Status: JACKED_IN
Terminal ID: ed25519:a3f7b2...
Contacts: 3
Connection: Operator (wss://op.whiterabbit.sh)
User: Jay
```

### `rabbit config set <key> <value>`

```bash
# 사용자 이름 설정
$ rabbit config set userName "Neo"
✓ User name updated

# UX 메시지에서 사용됨:
# "Wake up, Neo..."
# "Knock, knock, Neo."
```

---

## 데이터 저장

### 로컬 저장 위치

```
~/.whiterabbit/
  ├── config.json          # 설정 파일
  ├── contacts.db          # SQLite: 연락처
  └── keys/
      ├── terminal.key     # Ed25519 개인키
      └── terminal.pub     # Ed25519 공개키
```

### 영구 저장 (Persistent)

- **Access Code**: 재연결 시 사용
- **Terminal ID**: 공개키/개인키 쌍
- **연락처 목록**: 이름, Handle, 추가 시각
- **설정**: 
  - 사용자 이름/별칭 (UX 메시지에 사용: "Wake up, {name}...")
  - 테마, 알림 설정 등

```json
// config.json 예시
{
  "userName": "Jay",
  "accessCode": "WR-A3F7B2C8-9D1E",
  "terminalId": "ed25519:a3f7b2...",
  "operatorUrl": "wss://op.whiterabbit.sh",
  "theme": "dark",
  "notifications": true
}
```

### 휘발성 (In-Memory)

- **메시지 히스토리**: 세션 동안만 메모리에 유지
- **WebRTC Connection**: 연결 종료 시 즉시 폐기

### 저장하지 않음 (Never Store)

- 메시지 내용 (디스크에 절대 기록 안 함)
- 통화 기록 / 로그
- 상대방 IP 주소

---

## 보안 구현

### 1. Terminal Identity

- Ed25519 키 생성 (libsodium)
- 개인키: `~/.whiterabbit/keys/terminal.key` (chmod 600)
- 공개키: Operator에 공유
- 서명: jack_in 시 timestamp 서명하여 인증

```typescript
interface JackInPayload {
  accessCode: string;
  terminalId: string;      // ed25519:publickey
  timestamp: number;
  signature: string;        // sign(timestamp, privateKey)
}
```

### 2. WebRTC P2P

- DTLS-SRTP 암호화 (WebRTC 기본)
- Perfect Forward Secrecy
- ICE candidate를 Operator를 통해서만 교환
- 연결 후 Operator 경유 없이 직접 통신

### 3. No Message Persistence

- 메시지는 React state에만 존재
- 세션 종료 시 state 초기화
- 디스크 스왑 방지 (메모리 내에서만 처리)

### 4. Local Data Encryption

- Access Code: 평문 저장 (로컬 파일 시스템 보안에 의존)
- 개인키: chmod 600
- 옵션: 전체 디렉토리 암호화 (향후)

---

## 기술 스택

### Core

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **UI Framework**: Ink (React for CLI)
- **WebSocket**: ws
- **WebRTC**: simple-peer (wrtc for Node.js)
- **Crypto**: libsodium (Ed25519)
- **Local DB**: better-sqlite3

### CLI

- **Argument Parsing**: commander
- **Prompts**: enquirer
- **Colors**: chalk
- **Box Drawing**: boxen

### Build & Package

- **Bundler**: esbuild
- **Package**: pkg / nexe
- **Installer**: create-dmg (macOS), electron-builder (cross-platform)

---

## 성능 목표

- **앱 시작**: < 300ms
- **jack_in 응답**: < 500ms
- **WebRTC 연결 수립**: < 2초
- **메시지 지연**: < 100ms (P2P)
- **타이핑 인디케이터**: < 50ms
- **메모리 사용**: < 50MB (idle)

---

## 에러 처리

### Network Errors

| 에러 | 표시 | 복구 |
|------|------|------|
| WebSocket 연결 실패 | `✗ Cannot reach Operator` | 자동 재시도 (3회) |
| jack_in 거절 | `✗ Access denied` | 메인 화면, Access Code 재확인 요청 |
| WebRTC 연결 실패 | `✗ Connection failed` | 메인 화면 복귀 |
| Pulse timeout | `✗ Connection lost` | 자동 재연결 시도 |

### User Errors

| 에러 | 표시 |
|------|------|
| Invalid Access Code | `✗ Invalid code format` |
| Contact not found | `✗ Contact not found: {name}` |
| Duplicate contact | `✗ Contact already exists` |
| Busy (통화 중 수신) | `✗ {name} is busy` |

---

## Pulse (Heartbeat)

- 간격: 30초
- Operator와 양방향 pulse 교환
- Timeout: 60초
- 응답 없으면 재연결 시도

---

## 확장 계획

### Phase 1 (MVP)

- 텍스트 메시지 P2P 전송
- 연락처 관리
- 기본 TUI

### Phase 2

- 타이핑 인디케이터
- 메시지 타이핑 효과
- UNKNOWN 연락처 관리 개선

### Phase 3

- 테마 설정
- 알림 사운드
- 통계 (연결 시간 등)

### Phase 4

- 파일 전송 (P2P)
- 음성 통화 (WebRTC audio)
- 멀티 Operator 지원

---

## 접근성

- 키보드 전용 내비게이션
- 스크린 리더 호환 (향후)
- 고대비 테마 지원
- 색맹 모드 (상태를 아이콘으로도 표시)

---

## 테스트 전략

### Unit Tests

- 상태 전환 로직
- 연락처 CRUD
- 암호화/서명 검증

### Integration Tests

- Operator WebSocket 통신
- WebRTC 연결 수립
- 메시지 송수신

### E2E Tests

- 전체 통화 플로우
- 에러 시나리오
- 재연결 시나리오

---

## 개발 우선순위

1. **P0**: Access Code 인증, jack_in/out
2. **P0**: 연락처 로컬 저장 (CRUD)
3. **P0**: WebRTC P2P 연결
4. **P0**: 텍스트 메시지 전송/수신
5. **P1**: TUI 화면 구성
6. **P1**: 상태 전환 로직
7. **P1**: Signal 실시간 업데이트
8. **P1**: UNKNOWN 수신 및 Save Contact 기능
9. **P2**: 타이핑 효과
10. **P3**: 테마, 설정

---

## 알려진 제약사항

- **NAT Traversal**: STUN/TURN 서버 필요 (일부 방화벽 환경)
- **WebRTC in Node.js**: wrtc 라이브러리 필요 (네이티브 빌드)
- **Cross-platform**: Windows에서 제한적 지원 (WSL 권장)
- **Offline**: Jack in 없이는 사용 불가

---

## 라이선스 & 배포

- **라이선스**: Proprietary (상용)
- **가격**: $9.99 (1 Device License)
- **배포**: 웹사이트 직접 판매
- **업데이트**: 자동 업데이트 (Electron auto-updater 또는 유사)

---

> *"The Operative remembers nothing. It only connects, speaks, and forgets."*
