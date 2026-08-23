import { initFederation } from '@angular-architects/native-federation';
import { env } from '../@environments/environment';

window.console.warn = () => {};

const dev = {
  // -- AVOID NOWRAP -- //
};

const prod = {
  // -- AVOID NOWRAP -- //
};

initFederation(env.remoteMfs ? prod : dev)
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
