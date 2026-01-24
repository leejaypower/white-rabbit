# White Rabbit - Server PRD

## 제품 정의

White Rabbit Server는 P2P 터미널 통신을 위한 시그널링 및 프레즌스 서버이다. 메시지를 중계하지 않으며, 연결 설정과 상태 관리만 담당한다. 서버는 아무것도 기억하지 않는다.

---

## 핵심 컨셉

- **Stateless**: 영구 저장소 없음, 메모리 기반 세션만 유지
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
- 상태: `OFFLINE` / `ONLINE` / `BUSY`
- 연결 해제 시 즉시 `OFFLINE` 처리
- Heartbeat 기반 연결 유지 확인

### 3. 라이선스 (License)

라이선스 키 활성화 및 검증

- 최초 활성화 시 디바이스 바인딩
- Fingerprint 기반 디바이스 식별
- 활성화 후 오프라인 사용 허용

---

## 통신 프로토콜

### WebSocket Events

| Event | Direction | 설명 |
|-------|-----------|------|
| `register` | Client → Server | 클라이언트 등록 (fingerprint 포함) |
| `presence` | Server → Client | 연락처 상태 업데이트 |
| `call` | Client → Server | 통화 요청 |
| `ring` | Server → Client | 수신 통화 알림 |
| `accept` | Client → Server | 통화 수락 |
| `reject` | Client → Server | 통화 거절 |
| `busy` | Server → Client | 상대방 통화 중 |
| `signal` | Bidirectional | WebRTC 시그널링 (SDP/ICE) |
| `hangup` | Bidirectional | 통화 종료 |
| `heartbeat` | Bidirectional | 연결 유지 확인 |

---

## 데이터 저장

### 영구 저장 (Persistent)

- 라이선스 키 목록
- 디바이스 바인딩 정보 (fingerprint ↔ license)

### 메모리 저장 (In-Memory)

- 활성 WebSocket 세션
- 현재 프레즌스 상태
- 진행 중인 통화 세션

### 저장하지 않음 (Never Store)

- 메시지 내용
- 통화 기록/로그
- 연락처 목록
- IP 주소 (로깅 제외)

---

## 보안 원칙

- **No Message Access**: 메시지는 P2P로만 전송, 서버 경유 없음
- **No Logging**: 통화 내용 및 메타데이터 로깅 금지
- **Minimal Data**: 서비스 운영에 필수적인 데이터만 처리
- **TLS Required**: 모든 통신 암호화 필수
- **Rate Limiting**: 악용 방지를 위한 요청 제한

---

## 확장성

- 단일 서버로 시작
- 수평 확장 시 Redis 기반 세션 공유 고려
- 지역별 서버 배포 가능 (latency 최적화)

---

## 기술 스택 (권장)

- **Runtime**: Node.js
- **WebSocket**: ws
- **Storage**: 미정 + In-Memory (세션)
- **Deployment**: Docker

---

## 성능 목표

- 동시 연결: 10,000+ WebSocket 세션
- 시그널링 지연: < 100ms
- Heartbeat 간격: 30초
- 연결 타임아웃: 60초

---

> *"The server remembers nothing. It only connects."*