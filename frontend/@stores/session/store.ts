import { UserDataFromToken } from '@common/services';
import { Session, TokCreAndExpInfo } from './entity';
import { GCM_CONTEXTS } from '@common/types';

export const sessionInitialState: Session = new Session(
  new TokCreAndExpInfo(new Date(), new Date()),
  GCM_CONTEXTS.DEFAULT,
  new UserDataFromToken('', '', '', false),
  [],
  false,
);
