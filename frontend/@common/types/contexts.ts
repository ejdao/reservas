import { CtmType } from '@eklipse/ng-utilities/types';

export type GcmContextCode = 'DEFAULT';

export class GcmContextType extends CtmType<GcmContextCode> {}

const DEFAULT = new GcmContextType('DEFAULT', 'Default BBDD');

export const gcmContextTypeFactory = (context: GcmContextCode) => {
  switch (context) {
    case 'DEFAULT': return DEFAULT;
    default: return DEFAULT;
  }
};

export const GCM_CONTEXTS = { DEFAULT };

export const GCM_CONTEXTS_VALUES = Object.values(GCM_CONTEXTS);

export interface AllCtxExceptI {
  types: GcmContextType[];
  codes: GcmContextCode[];
}

export function allContexts(except: GcmContextType[] = []): AllCtxExceptI {
  const validCtxs: GcmContextType[] = [];
  const ctxs = [...GCM_CONTEXTS_VALUES];

  ctxs.forEach((ctx) => {
    if (!except.filter((el) => el === ctx).length) validCtxs.push(ctx);
  });

  const codes = validCtxs.map((r) => r.getCode());
  return { types: validCtxs, codes };
}
