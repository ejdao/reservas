import { ApiBearerAuth } from '@nestjs/swagger';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ActiveTokenGuard, AuthoritiesGuard, JwtAuthGuard } from '@common/infrastructure/guards';

export function CommonGuards() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, ActiveTokenGuard, AuthoritiesGuard),
    ApiBearerAuth()
  );
}
