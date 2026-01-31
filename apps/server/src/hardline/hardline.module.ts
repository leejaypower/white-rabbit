import { Module } from '@nestjs/common';
import { SignalModule } from '../signal/signal.module';
import { HardlineService } from './hardline.service';

@Module({
  imports: [SignalModule],
  providers: [HardlineService],
  exports: [HardlineService],
})
export class HardlineModule {}
