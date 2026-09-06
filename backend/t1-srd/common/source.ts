import { Injectable } from '@nestjs/common';
import { CTM_CONTEXTS } from '@common/domain/types';
import { switchConn } from '@connections';

@Injectable()
export class SharedBaseSource {
  protected conn = switchConn(CTM_CONTEXTS.SHARED);
}
