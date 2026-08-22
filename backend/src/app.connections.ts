import { DataSource } from 'typeorm';
import { CTM_CONTEXTS, CtmContextType } from '@common/domain/types';
import { JustForVerifyOrm } from '@common/infrastructure/services';
import { ORM_SHARED_ENTITIES } from '@orm/shared';
import { ORM_ENTITIES } from './app.entities';
import * as dotenv from 'dotenv';
dotenv.config();

const type = 'postgres';
const port = 5432;

export const SHARED_DES = new DataSource({
  username: process.env.SHARED_USERNAME_DB,
  password: process.env.SHARED_PASS_DB,
  database: process.env.SHARED_NAME_DB,
  host: process.env.SHARED_HOST_DB,
  entities: ORM_SHARED_ENTITIES,
  synchronize: false,
  type,
  port,
});

const synchronize = false;
const entities = ORM_ENTITIES;
if(!synchronize) entities.unshift(JustForVerifyOrm as any)

export const DEFAULT_DES = new DataSource({
  username: process.env.DEFAULT_USERNAME_DB,
  password: process.env.DEFAULT_PASS_DB,
  database: process.env.DEFAULT_NAME_DB,
  host: process.env.DEFAULT_HOST_DB,
  entities,
  synchronize,
  type,
  port,
});

export const DATASOURCES = [
  {ctx : CTM_CONTEXTS.SHARED, ds : SHARED_DES},
  {ctx : CTM_CONTEXTS.DEFAULT, ds : DEFAULT_DES},
];

export const switchConn = (context: CtmContextType) => {
  switch (context) {
    case CTM_CONTEXTS.SHARED: return SHARED_DES;
    case CTM_CONTEXTS.DEFAULT: return DEFAULT_DES;
  }
};
