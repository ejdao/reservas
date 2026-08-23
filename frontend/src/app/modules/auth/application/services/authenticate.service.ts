import { LoginRes } from '../responses';
import { LoginUserPayload } from '../payloads';

export abstract class AuthenticateService {
  abstract loginUser(payload: LoginUserPayload): Promise<LoginRes>;
}
