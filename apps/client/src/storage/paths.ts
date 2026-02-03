import path from 'node:path';
import os from 'node:os';

/**
 * White Rabbit 로컬 저장소 경로 상수
 * 
 * 모든 데이터는 ~/.whiterabbit/ 디렉토리에 저장됩니다.
 * - 연락처 (contacts.db)
 * - 설정 파일 (config.json)
 * - 암호화 키 (keys/)
 */

// 홈 디렉토리 기반 경로 생성 헬퍼
function getHomePath(...segments: string[]): string {
    return path.join(os.homedir(), '.whiterabbit', ...segments);
}

/**
 * 루트 디렉토리: ~/.whiterabbit/
 * 모든 White Rabbit 데이터의 루트
 */
export const WHITE_RABBIT_DIR = getHomePath();

/**
 * 설정 파일: ~/.whiterabbit/config.json
 * 사용자 이름, Access Code, Operator URL 등 저장
 */
export const CONFIG_FILE = getHomePath('config.json');

/**
 * 연락처 데이터베이스: ~/.whiterabbit/contacts.db
 * SQLite 데이터베이스로 연락처 목록 저장
 */
export const CONTACTS_DB = getHomePath('contacts.db');

/**
 * 키 디렉토리: ~/.whiterabbit/keys/
 * Ed25519 키 쌍 저장 (개인키, 공개키)
 */
export const KEYS_DIR = getHomePath('keys');

/**
 * 개인키: ~/.whiterabbit/keys/terminal.key
 * Ed25519 개인키 (chmod 600 필수)
 * ⚠️ 절대 외부로 전송하지 않음!
 */
export const PRIVATE_KEY = getHomePath('keys', 'terminal.key');

/**
 * 공개키: ~/.whiterabbit/keys/terminal.pub
 * Ed25519 공개키 (Terminal ID의 기반)
 * Operator에 공유됨
 */
export const PUBLIC_KEY = getHomePath('keys', 'terminal.pub');

/**
 * 경로 목록 (초기화 및 검증용)
 */
export const PATHS = {
    root: WHITE_RABBIT_DIR,
    config: CONFIG_FILE,
    contacts: CONTACTS_DB,
    keysDir: KEYS_DIR,
    privateKey: PRIVATE_KEY,
    publicKey: PUBLIC_KEY,
} as const;
