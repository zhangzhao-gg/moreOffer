import { OfferData } from '../types';

// 测试数据
export const MOCK_OFFER_DATA: OfferData[] = [
  {
    offerCount: 3,
    salaryRange: '15-25K',
    industry: '互联网'
  },
  {
    offerCount: 1,
    salaryRange: '20-30K',
    industry: '金融'
  },
  {
    offerCount: 2,
    salaryRange: '12-18K',
    industry: '教育'
  },
  {
    offerCount: 4,
    salaryRange: '25-35K',
    industry: '人工智能'
  }
];

// 行业选项
export const INDUSTRY_OPTIONS = [
  '互联网',
  '金融',
  '教育',
  '医疗',
  '人工智能',
  '区块链',
  '游戏',
  '电商',
  '制造业',
  '咨询',
  '其他'
];

// 薪资区间选项
export const SALARY_OPTIONS = [
  '5-10K',
  '10-15K',
  '15-20K',
  '20-25K',
  '25-30K',
  '30-40K',
  '40-50K',
  '50K以上'
];
