export interface NavRoute {
  id: string;
  label: string;
  icon: string;
  description?: string;
  authorities?: string[];
  disableOnContexts?: string[];
  forceDisabledContent?: boolean;
  href?: string;
  wasDisabled?: boolean;
}

export interface NavSubmodule {
  id: string;
  label: string;
  icon: string;
  accent?: string;
  description?: string;
  authorities?: string[];
  disableOnContexts?: string[];
  forceDisabledContent?: boolean;
  routes: NavRoute[];
  wasDisabled?: boolean;
}

export interface NavModule {
  isSingleRoute?: boolean;
  href?: string;
  id: string;
  label: string;
  icon: string;
  accent?: string;
  description?: string;
  authorities?: string[];
  disableOnContexts?: string[];
  forceDisabledContent?: boolean;
  submodules: NavSubmodule[];
  wasDisabled?: boolean;
}

export interface DashboardConfig {
  icon: string;
  enterpriseName: string;
  contextCode: string;
  contextForHumans: string;
  userFullName: string;
  userFirstName: string;
  userInitials: string;
  roleName: string;
  authorities: string[];
  localhostUrl: string;
  homeUrl: string;
}
