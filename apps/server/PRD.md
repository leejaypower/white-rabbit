# White Rabbit - Server PRD

## 제품 정의

White Rabbit Server는 P2P 터미널 통신을 위한 시그널링 및 프레즌스 서버이다. 메시지를 중계하지 않으며, 연결 설정과 상태 관리만 담당한다.

서버는 대화와 세션을 기억하지 않는다. 필수적인 라이선스 정보만 최소한으로 보관한다.

> *White Rabbit Server는 참여자가 아니다. 서버는 연결을 가능하게 할 뿐, 대화에는 관여하지 않는다.*

---

## 핵심 컨셉

- **Stateless by Default**: 세션과 프레즌스는 메모리에서만 유지. 영구 저장은 라이선스 검증에 필요한 최소 정보로 한정
- **Minimal Role**: 시그널링, 프레즌스, 라이선스 검증만 수행
- **Zero Trust**: 메시지 내용에 접근하지 않음
- **Ephemeral**: 연결 종료 시 모든 세션 데이터 즉시 폐기

---

## 서버 역할

### 1. 시그널링 (Signaling)

WebRTC P2P 연결 수립을 위한 시그널링 중계

- SDP Offer/Answer 교환
- ICE Candidate 교환
- 연결 수립 후 역할 종료

### 2. 프레즌스 (Presence)

클라이언트 온라인 상태 관리

- WebSocket 연결 기반 상태 추적
- 상태: `OFFLINE` / `ONLINE`
- 연결 해제 시 즉시 `OFFLINE` 처리
- Heartbeat 기반 연결 유지 확인

> *Presence란 "지금 이 Peer에게 닿을 수 있는가"에 대한 정보다. 그 이상도, 그 이하도 아니다.*

### 3. 라이선스 (License)

라이선스 키 활성화 및 검증

- 최초 활성화 시 디바이스 바인딩
- 클라이언트가 생성한 identity에 바인딩 (`device_id`, `peer_id`)
- 서버는 fingerprinting을 수행하지 않음
- 라이선스 검증은 서버 연결 시마다 수행
- 오프라인 상태에서는 서비스 이용 불가

---

## 통신 프로토콜

### WebSocket Events

| Event | Direction | 설명 |
|-------|-----------|------|
| `register` | Client → Server | 클라이언트 등록 (`license_key`, `device_id`, `peer_id` 포함) |
| `presence` | Server → Client | 연락처 상태 업데이트 |
| `call` | Client → Server | 통화 요청 |
| `ring` | Server → Client | 수신 통화 알림 |
| `accept` | Client → Server | 통화 수락 |
| `reject` | Client → Server | 통화 거절 |
| `signal` | Bidirectional | WebRTC 시그널링 (SDP/ICE) |
| `hangup` | Bidirectional | 통화 종료 |
| `heartbeat` | Bidirectional | 연결 유지 확인 |

---

## 데이터 저장

### 영구 저장 (Persistent)

- 라이선스 키 목록
- 디바이스 바인딩 정보 (`device_id` ↔ `license_key`)

### 메모리 저장 (In-Memory)

- 활성 WebSocket 세션
- 현재 프레즌스 상태

### 저장하지 않음 (Never Store)

- 메시지 내용
- 통화 기록/로그
- 연락처 목록
- IP 주소 (애플리케이션 레벨에서 저장하지 않음. 인프라 레벨 로그는 별도 정책에 따름)

---

## 보안 원칙

- **No Message Access**: 메시지는 P2P로만 전송, 서버 경유 없음
- **No Logging**: 통화 내용 및 메타데이터 로깅 금지
- **Minimal Data**: 서비스 운영에 필수적인 데이터만 처리
- **No Fingerprinting**: 서버는 디바이스 fingerprinting을 수행하지 않음
- **TLS Required**: 모든 통신 암호화 필수
- **Rate Limiting**: 악용 방지를 위한 요청 제한

---

## 확장성

- 단일 서버로 시작
- 수평 확장 시 Redis 기반 Presence / Connection Routing 공유 고려
- 지역별 서버 배포 가능 (latency 최적화)

---

## 기술 스택

- **Runtime**: Node.js
- **Framework**: NestJS
- **WebSocket**: ws
- **ORM**: MikroORM
- **Database**: PostgreSQL (RDS)
- **Session**: In-Memory
- **Deployment**: Docker

---

## 성능 목표

- 동시 연결: 10,000+ WebSocket 세션
- 시그널링 지연: < 100ms
- Heartbeat 간격: 30초
- 연결 타임아웃: 60초

---

> *"The server remembers nothing. It only connects."*