// 定义Offer数据类型
export interface OfferData {
  offerCount: number;
  salaryRange: string;
  industry: string;
}

// 定义应用状态类型
export interface AppState {
  currentView: 'form' | 'dashboard';
  formData: OfferData;
  isSubmitting: boolean;
  submittedData: OfferData | null;
}

// 定义API响应类型
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

// 定义路由类型
export type RouteType = 'home' | 'dashboard' | 'profile' | 'settings';
