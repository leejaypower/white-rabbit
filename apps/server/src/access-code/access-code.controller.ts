import { Controller, Post, Patch, Param, NotFoundException } from '@nestjs/common';
import { AccessCodeService } from './access-code.service';

@Controller('access-codes')
export class AccessCodeController {
  constructor(private readonly accessCodeService: AccessCodeService) {}

  @Post()
  async create() {
    return this.accessCodeService.create();
  }

  @Patch(':code/activate')
  async activate(@Param('code') code: string) {
    const result = await this.accessCodeService.activate(code);
    if (!result) throw new NotFoundException('Access code not found');
    return result;
  }
}
