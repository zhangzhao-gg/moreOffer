export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const;

export const ROUTE_NAMES = {
  [ROUTES.HOME]: '首页',
  [ROUTES.DASHBOARD]: '数据看板',
  [ROUTES.PROFILE]: '个人资料',
  [ROUTES.SETTINGS]: '设置'
} as const;
