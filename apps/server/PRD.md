# White Rabbit - Operator PRD

## 제품 정의

White Rabbit Operator는 P2P 터미널 통신을 위한 Hardline 및 Signal 서버이다. 메시지를 중계하지 않으며, 연결 설정과 상태 관리만 담당한다.

Operator는 대화와 Link를 기억하지 않는다. 필수적인 Access Code 정보만 최소한으로 보관한다.

> *Operator는 참여자가 아니다. Operator는 연결을 가능하게 할 뿐, 대화에는 관여하지 않는다.*

---

## 핵심 컨셉

- **Stateless by Default**: Link와 Signal은 메모리에서만 유지. 영구 저장은 Access Code 검증에 필요한 최소 정보로 한정
- **Minimal Role**: Hardline, Signal, Access Code 검증만 수행
- **Zero Trust**: 메시지 내용에 접근하지 않음
- **Ephemeral**: 연결 종료 시 모든 Link 데이터 즉시 폐기

---

## Operator 역할

### 1. Hardline (Signaling)

WebRTC P2P 연결 수립을 위한 Hardline 중계

- SDP Offer/Answer 교환
- ICE Candidate 교환
- 연결 수립 후 역할 종료

### 2. Signal (Presence)

Operative 접속 상태 관리

- WebSocket 연결 기반 상태 추적
- 상태: `JACKED_OUT` / `JACKED_IN`
- 연결 해제 시 즉시 `JACKED_OUT` 처리
- Pulse 기반 연결 유지 확인

> *Signal이란 "지금 이 Operative에게 닿을 수 있는가"에 대한 정보다. 그 이상도, 그 이하도 아니다.*

### 3. Access Code (License)

Access Code 활성화 및 검증
- 최초 활성화 시 Terminal 바인딩
- `terminal_id`는 Operative가 생성한 공개키 (예: `ed25519:abc123...`)
- 개인키는 클라이언트에만 저장, Operator는 공개키만 알고 있음
- Operator는 fingerprinting을 수행하지 않음
- Access Code 검증은 jack_in 시마다 수행
- Jacked out 상태에서는 서비스 이용 불가

---

## 통신 프로토콜

### WebSocket Events

| Event | Direction | 설명 |
|-------|-----------|------|
| `jack_in` | Operative → Operator | Operative 접속 (`access_code`, `terminal_id` 포함) |
| `signal` | Operator → Operative | 연락처 상태 업데이트 |
| `ring` | Operative → Operator | 통화 요청 |
| `incoming` | Operator → Operative | 수신 통화 알림 |
| `patch_through` | Operative → Operator | 통화 수락 |
| `disconnect` | Operative → Operator | 통화 거절 |
| `hardline` | Bidirectional | WebRTC 시그널링 (SDP/ICE) |
| `jack_out` | Bidirectional | 통화 종료 |
| `pulse` | Bidirectional | 연결 유지 확인 |

---

## 데이터 저장

### 영구 저장 (Persistent)

- Access Code 목록
- Terminal 바인딩 정보 (`terminal_id`(공개키) ↔ `access_code`)

### 메모리 저장 (In-Memory)

- 활성 WebSocket Link
- 현재 Signal 상태

### 저장하지 않음 (Never Store)

- 메시지 내용
- 통화 기록/로그
- 연락처 목록
- IP 주소 (애플리케이션 레벨에서 저장하지 않음. 인프라 레벨 로그는 별도 정책에 따름)

---

## 보안 원칙

- **No Message Access**: 메시지는 P2P로만 전송, Operator 경유 없음
- **No Logging**: 통화 내용 및 메타데이터 로깅 금지
- **Minimal Data**: 서비스 운영에 필수적인 데이터만 처리
- **No Fingerprinting**: Operator는 Terminal fingerprinting을 수행하지 않음
- **TLS Required**: 모든 통신 암호화 필수
- **Rate Limiting**: 악용 방지를 위한 요청 제한

---

## 확장성

- 단일 Operator로 시작
- 수평 확장 시 Redis 기반 Signal / Connection Routing 공유 고려
- 지역별 Operator 배포 가능 (latency 최적화)

---

## 기술 스택

- **Runtime**: Node.js
- **Framework**: NestJS
- **WebSocket**: ws
- **ORM**: MikroORM
- **Database**: PostgreSQL (RDS)
- **Link**: In-Memory
- **Deployment**: Docker

---

## 성능 목표

- 동시 연결: 10,000+ WebSocket Link
- Hardline 지연: < 100ms
- Pulse 간격: 30초
- 연결 타임아웃: 60초

---

> *"The Operator remembers nothing. It only patches you through."*