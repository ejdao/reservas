import { GcmContextCode } from '@common/types';

export interface LoginUserPayload {
  contextCode: GcmContextCode;
  username: string;
  password: string;
}
