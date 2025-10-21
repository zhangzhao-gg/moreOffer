import { OfferData, ApiResponse } from '../types';
import { API_CONFIG } from '../utils/constants';

export class ApiService {
  static async submitOfferData(data: OfferData): Promise<ApiResponse<OfferData>> {
    try {
      console.log('发送的数据:', data);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/`);
      return await response.json();
    } catch (error) {
      console.error('健康检查失败:', error);
      throw error;
    }
  }
}
