import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { randomBytes } from 'crypto';
import * as ed from '@noble/ed25519';
import { JackInPayload } from '@white-rabbit/shared';
import { AccessCode } from './access-code.entity';

@Injectable()
export class AccessCodeService {
  constructor(private readonly em: EntityManager) {}

  async validate(
    payload: JackInPayload,
  ): Promise<{ valid: boolean; reason?: string }> {
    const { accessCode, terminalId, timestamp, signature } = payload;

    // 1. ed25519 signature verification
    const message = new TextEncoder().encode(
      `${accessCode}:${terminalId}:${timestamp}`,
    );
    try {
      const sigBytes = Buffer.from(signature, 'hex');
      const pubKey = Buffer.from(terminalId, 'hex');
      const valid = await ed.verifyAsync(sigBytes, message, pubKey);
      if (!valid) {
        return { valid: false, reason: 'invalid_signature' };
      }
    } catch {
      return { valid: false, reason: 'invalid_signature' };
    }

    // 2. Lookup access code
    const code = await this.em.findOne(AccessCode, {
      code: accessCode,
      isActive: true,
    });
    if (!code) {
      return { valid: false, reason: 'invalid_access_code' };
    }

    // 3. Bind terminalId if first use
    if (code.terminalId === null) {
      code.terminalId = terminalId;
      await this.em.flush();
    }

    // 4. Check terminalId match
    if (code.terminalId !== terminalId) {
      return { valid: false, reason: 'terminal_mismatch' };
    }

    return { valid: true };
  }

  async create(): Promise<AccessCode> {
    const code = this.em.create(AccessCode, {
      code: randomBytes(16).toString('hex'),
    });
    await this.em.flush();
    return code;
  }

  async activate(codeValue: string): Promise<AccessCode | null> {
    const code = await this.em.findOne(AccessCode, { code: codeValue });
    if (!code) return null;
    code.isActive = true;
    await this.em.flush();
    return code;
  }
}
