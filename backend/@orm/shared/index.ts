import { EpsOrm } from './eps.orm';
import { ORM_UBI_ENTITIES } from './ubicacion';

export * from './eps.orm';

export const ORM_SHARED_ENTITIES = [...ORM_UBI_ENTITIES, EpsOrm];
