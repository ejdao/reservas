import { NavModule } from './config';

export const ADMIN_SIDEBAR_THEMES = [
  'red',
  'gray',
  'blue',
  'green',
  'amber',
  'teal',
  'purple',
  'cyan',
  'sky',
  'indigo',
  'pink',
  'rose',
  'lime',
  'emerald',
  'mint',
  'slate',
  'zinc',
  'neutral',
  'stone',
  'brown',
  'gold',
  'navy',
  'magenta',
  'lavender',
  'peach',
  'coral',
  'aqua',
  'forest',
  'olive',
  'sand',
  'chocolate',
  'plum',
  'turquoise',
  'steel',
  'charcoal',
  'cream',
  'ice',
  'blood',
  'sun',
  'royal',
  'electric',
  'midnight',
  'ruby',
];

const limit = ADMIN_SIDEBAR_THEMES.length;

export const setAleatorySidebarTheme = (): string => {
  return ADMIN_SIDEBAR_THEMES[Math.floor(Math.random() * limit)];
};

export const setAleatorySidebarThemeToAllModules = (modules: NavModule[]): NavModule[] => {
  return modules.map((m) => {
    if (!m.accent) m.accent = setAleatorySidebarTheme();
    m.submodules.map((sm) => {
      if (!sm.accent) sm.accent = setAleatorySidebarTheme();
      return sm;
    });
    return m;
  });
};
