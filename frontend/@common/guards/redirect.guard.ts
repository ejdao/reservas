import { ActivatedRouteSnapshot } from '@angular/router';

export const RedirectGuard = (route: ActivatedRouteSnapshot) => {
  const href = route.data!['href'] || undefined;

  if (href) window.open(href);

  return false;
};
