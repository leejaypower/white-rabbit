import { Module } from '@nestjs/common';
import { LinkStore } from './link.store';
import { SignalService } from './signal.service';
import { AccessCodeModule } from '../access-code/access-code.module';

@Module({
  imports: [AccessCodeModule],
  providers: [LinkStore, SignalService],
  exports: [SignalService, LinkStore],
})
export class SignalModule {}
