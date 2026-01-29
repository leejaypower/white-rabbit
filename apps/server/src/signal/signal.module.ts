import { Module } from '@nestjs/common';
import { LinkStore } from './link.store';
import { SignalService } from './signal.service';

@Module({
  providers: [LinkStore, SignalService],
  exports: [SignalService, LinkStore],
})
export class SignalModule {}
