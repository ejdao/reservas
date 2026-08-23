import { Pipe, PipeTransform } from '@angular/core';

interface PayloadFromUser {
  context: any;
  authorities: any | any[];
}

interface PayloadFromSystem {
  authorities: any | any[];
  blockOnCtxs: any | any[];
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/) // separa por espacios
    .filter(Boolean) // elimina vacíos
    .map((word) => word[0]) // toma la primera letra de cada palabra
    .slice(0, 2) // máximo 2 iniciales (opcional)
    .join('')
    .toUpperCase();
}

export function formatFullName(name: string): string {
  if (!name) return '';

  const lowerWords = new Set([
    'de',
    'del',
    'la',
    'las',
    'los',
    'y',
    'e',
    'da',
    'do',
    'dos',
    'das',
    'van',
    'von',
  ]);

  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (lowerWords.has(word) && index !== 0) {
        return word; // partículas en minúscula
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function getDisplayFirstName(fullName: string): string {
  if (!fullName) return '';

  const particles = new Set([
    'de',
    'del',
    'la',
    'las',
    'los',
    'y',
    'e',
    'da',
    'do',
    'dos',
    'das',
    'van',
    'von',
  ]);

  const parts = fullName.trim().toLowerCase().split(/\s+/);

  if (parts.length === 0) return '';

  const first = parts[0];

  // Si empieza con partícula → devolver partícula + siguiente palabra
  if (particles.has(first) && parts.length > 1) {
    return `${_capitalize(first)} ${_capitalize(parts[1])}`;
  }

  return _capitalize(first);
}

function _capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

export function moduleWasDisabled(_valuesToCompare: any[], _user: any[]) {
  const valuesToCompare: PayloadFromSystem = {
    authorities: _valuesToCompare[0],
    blockOnCtxs: _valuesToCompare[1],
  };

  const user: PayloadFromUser = {
    context: _user[0],
    authorities: _user[1],
  };

  let contextIsValid = true;
  let permissionsIsValid = true;

  let authorities: any[] | undefined;
  let blockOnCtxs: any[] | undefined;
  let userAuthorities: any[] | undefined;
  let userContext: any = user.context;

  if (valuesToCompare.authorities) {
    authorities = Array.isArray(valuesToCompare.authorities)
      ? valuesToCompare.authorities
      : [valuesToCompare.authorities];
  }

  if (valuesToCompare.blockOnCtxs) {
    blockOnCtxs = Array.isArray(valuesToCompare.blockOnCtxs)
      ? valuesToCompare.blockOnCtxs
      : [valuesToCompare.blockOnCtxs];
  }

  if (user.authorities) {
    userAuthorities = Array.isArray(user.authorities) ? user.authorities : [user.authorities];
  }

  if (blockOnCtxs) if (userContext) contextIsValid = !(blockOnCtxs.indexOf(userContext) >= 0);

  if (authorities) {
    if (userAuthorities) {
      permissionsIsValid = false;

      userAuthorities.forEach((userAuthority) => {
        if (authorities!.indexOf(userAuthority) >= 0) permissionsIsValid = true;
      });
    }
  }

  return !(contextIsValid && permissionsIsValid);
}

@Pipe({ name: 'validateAccess' })
export class ValidateAccessPipe implements PipeTransform {
  transform(_valuesToCompare: any[], _user: any[]) {
    return moduleWasDisabled(_valuesToCompare, _user);
  }
}
