// API配置
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  TIMEOUT: 10000,
} as const;

// 应用配置
export const APP_CONFIG = {
  NAME: 'Offer透透',
  VERSION: '1.0.0',
  DESCRIPTION: '一个现代化的Offer信息收集和展示系统',
} as const;

// 表单验证规则
export const VALIDATION_RULES = {
  OFFER_COUNT: {
    required: true,
    min: 0,
    message: 'Offer数量不能小于0'
  },
  SALARY_RANGE: {
    required: true,
    min: 2,
    message: '请输入有效的薪资区间'
  },
  INDUSTRY: {
    required: true,
    min: 2,
    message: '请输入有效的行业名称'
  }
} as const;

// 主题配置
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#667eea',
  SECONDARY_COLOR: '#764ba2',
  SUCCESS_COLOR: '#28a745',
  WARNING_COLOR: '#ffc107',
  ERROR_COLOR: '#dc3545',
  INFO_COLOR: '#17a2b8',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  USER_DATA: 'offer_user_data',
  FORM_DATA: 'offer_form_data',
  THEME: 'offer_theme',
  SETTINGS: 'offer_settings',
} as const;
