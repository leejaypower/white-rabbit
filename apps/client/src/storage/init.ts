import fs from 'node:fs';
import path from 'node:path';
import { WHITE_RABBIT_DIR, KEYS_DIR, PATHS } from './paths.js';

/**
 * White Rabbit 로컬 저장소 초기화
 * 
 * 디렉토리 생성 및 권한 설정을 수행합니다.
 */

/**
 * 디렉토리 존재 여부 확인
 */
export function directoryExists(dirPath: string): boolean {
  try {
    const stats = fs.statSync(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * 파일 존재 여부 확인
 */
export function fileExists(filePath: string): boolean {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * 디렉토리 생성 (권한 설정 포함)
 * 
 * @param dirPath - 생성할 디렉토리 경로
 * @param mode - 파일 권한 (기본값: 0o700 = rwx------)
 */
export function createDirectory(dirPath: string, mode: number = 0o700): void {
  if (directoryExists(dirPath)) {
    return;
  }

  try {
    fs.mkdirSync(dirPath, {
      recursive: true, // 부모 디렉토리도 자동 생성
      mode,            // chmod 700: 소유자만 접근 가능
    });
    console.log(`✓ Created directory: ${dirPath} (mode: ${mode.toString(8)})`);
  } catch (error) {
    throw new Error(
      `Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * White Rabbit 루트 디렉토리 초기화
 * 
 * ~/.whiterabbit/ 디렉토리를 생성합니다.
 * 권한: 0o700 (rwx------) - 소유자만 읽기/쓰기/실행 가능
 */
export function initializeRootDirectory(): void {
  console.log('Initializing White Rabbit directory...');
  createDirectory(WHITE_RABBIT_DIR, 0o700);
}

/**
 * 키 디렉토리 초기화
 * 
 * ~/.whiterabbit/keys/ 디렉토리를 생성합니다.
 * 권한: 0o700 (rwx------) - 개인키 보호를 위해 더욱 엄격
 */
export function initializeKeysDirectory(): void {
  console.log('Initializing keys directory...');
  createDirectory(KEYS_DIR, 0o700);
}

/**
 * 모든 디렉토리 초기화
 * 
 * White Rabbit에 필요한 모든 디렉토리를 생성합니다.
 * 이미 존재하는 경우 스킵됩니다.
 */
export function initializeDirectories(): void {
  console.log('🐰 Initializing White Rabbit storage...\n');

  // 1. 루트 디렉토리
  initializeRootDirectory();

  // 2. 키 디렉토리
  initializeKeysDirectory();

  console.log('\n✓ Storage initialized successfully!');
}

/**
 * 저장소 상태 확인
 * 
 * 필요한 디렉토리와 파일이 존재하는지 확인합니다.
 */
export interface StorageStatus {
  initialized: boolean;
  rootExists: boolean;
  keysDir: boolean;
  configExists: boolean;
  contactsDbExists: boolean;
  privateKeyExists: boolean;
  publicKeyExists: boolean;
}

export function checkStorageStatus(): StorageStatus {
  return {
    initialized: directoryExists(WHITE_RABBIT_DIR) && directoryExists(KEYS_DIR),
    rootExists: directoryExists(WHITE_RABBIT_DIR),
    keysDir: directoryExists(KEYS_DIR),
    configExists: fileExists(PATHS.config),
    contactsDbExists: fileExists(PATHS.contacts),
    privateKeyExists: fileExists(PATHS.privateKey),
    publicKeyExists: fileExists(PATHS.publicKey),
  };
}

/**
 * 저장소 초기화 여부 확인
 * 
 * @returns 저장소가 초기화되었으면 true
 */
export function isStorageInitialized(): boolean {
  const status = checkStorageStatus();
  return status.initialized;
}

/**
 * 저장소 상태 출력 (디버깅용)
 */
export function printStorageStatus(): void {
  const status = checkStorageStatus();

  console.log('📦 Storage Status:\n');
  console.log(`  Root directory:    ${status.rootExists ? '✓' : '✗'} ${PATHS.root}`);
  console.log(`  Keys directory:    ${status.keysDir ? '✓' : '✗'} ${PATHS.keysDir}`);
  console.log(`  Config file:       ${status.configExists ? '✓' : '✗'} ${PATHS.config}`);
  console.log(`  Contacts DB:       ${status.contactsDbExists ? '✓' : '✗'} ${PATHS.contacts}`);
  console.log(`  Private key:       ${status.privateKeyExists ? '✓' : '✗'} ${PATHS.privateKey}`);
  console.log(`  Public key:        ${status.publicKeyExists ? '✓' : '✗'} ${PATHS.publicKey}`);
  console.log(`\n  Initialized:       ${status.initialized ? '✓ Yes' : '✗ No'}`);
}
