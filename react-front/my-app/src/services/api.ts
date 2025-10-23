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

  static async getStats(industry?: string, salaryRange?: string): Promise<ApiResponse<any>> {
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (industry) params.append('industry', industry);
      if (salaryRange) params.append('salaryRange', salaryRange);
      
      const url = `${API_CONFIG.BASE_URL}/api/stats${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取统计数据失败:', error);
      throw error;
    }
  }
}
