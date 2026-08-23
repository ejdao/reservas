import { env } from '../../@environments/environment';

export const APP_INFO = {
  company: 'Generic company',
  name: 'Ejdao dev',
  version: '1.0',
  released: '2026.08.22',
  year: '2026',
};

let lclHstExt = !location.href.includes('https://') ? `:9135` : `/${APP_INFO.version}`;

if (!location.href.includes(lclHstExt)) lclHstExt = '/testing';

export const LOCAL_URLS = {
  home: '',
  login: 'access-control/login',
  host: env.localHost + lclHstExt + '/#',
};
