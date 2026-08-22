import { ORM_SEG_ENTITIES } from '@orm/seguridad';
import { ORM_GEN_ENTITIES } from '@orm/general';
import { ORM_RSV_ENTITIES } from '@orm/reservas';

export const ORM_ENTITIES = [...ORM_SEG_ENTITIES, ...ORM_GEN_ENTITIES, ...ORM_RSV_ENTITIES];
