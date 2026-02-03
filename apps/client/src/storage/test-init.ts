#!/usr/bin/env node

/**
 * Storage 초기화 테스트 스크립트
 * 
 * 실행: node --loader ts-node/esm src/storage/test-init.ts
 * 또는: tsx src/storage/test-init.ts
 */

import {
    initializeDirectories,
    printStorageStatus,
    checkStorageStatus,
} from './init.js';

async function main() {
    console.log('🐰 White Rabbit Storage Initialization Test\n');
    console.log('='.repeat(50));
    console.log();

    // 1. 초기 상태 확인
    console.log('📊 Current Status (BEFORE initialization):\n');
    printStorageStatus();
    console.log();
    console.log('='.repeat(50));
    console.log();

    // 2. 디렉토리 초기화
    try {
        initializeDirectories();
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }

    console.log();
    console.log('='.repeat(50));
    console.log();

    // 3. 초기화 후 상태 확인
    console.log('📊 Status (AFTER initialization):\n');
    printStorageStatus();

    // 4. 결과 확인
    const status = checkStorageStatus();
    console.log();
    console.log('='.repeat(50));

    if (status.initialized) {
        console.log('\n✅ All directories initialized successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Generate Ed25519 keys (Phase 1.2)');
        console.log('   2. Create config.json (Phase 1.3)');
        console.log('   3. Initialize contacts.db (Phase 1.4)');
    } else {
        console.log('\n❌ Initialization incomplete!');
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
