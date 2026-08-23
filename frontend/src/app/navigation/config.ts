import { LOCAL_URLS } from '@common/constants';
import { NavModule, setAleatorySidebarThemeToAllModules } from '../admin/config';
import { SEG_SNAV_ITEMS } from './seguridad';

export const NAVIGATION_CONFIG: NavModule[] = setAleatorySidebarThemeToAllModules([
  {
    isSingleRoute: true,
    href: LOCAL_URLS.home,
    id: 'home',
    label: 'Home',
    icon: 'house',
    description: 'Home.',
    submodules: [],
  },
  ...SEG_SNAV_ITEMS,
]);
