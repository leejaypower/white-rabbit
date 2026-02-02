import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AccessCode } from './access-code.entity';
import { AccessCodeService } from './access-code.service';
import { AccessCodeController } from './access-code.controller';

@Module({
  imports: [MikroOrmModule.forFeature([AccessCode])],
  providers: [AccessCodeService],
  controllers: [AccessCodeController],
  exports: [AccessCodeService],
})
export class AccessCodeModule {}
