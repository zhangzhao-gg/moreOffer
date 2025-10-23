import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Empty, Typography, Progress, Space, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { 
  TrophyOutlined, 
  DollarOutlined, 
  BankOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  FileTextOutlined,
  RiseOutlined,
  UserOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { submittedData, resetForm } = useAppStore();
  const [statsData, setStatsData] = useState({
    totalSubmissions: 0,
    offerRate: 0,
    avgOffers: 0,
    todayNew: 0
  });
  const [salaryDistribution, setSalaryDistribution] = useState<Array<{salary_range: string, count: number}>>([]);
  const [personalStats, setPersonalStats] = useState({
    aboveAveragePercent: 0,
    industryPercentile: 0
  });

  // 获取统计数据
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 传递用户的行业和薪资区间参数
        const response = await ApiService.getStats(
          submittedData?.industry,
          submittedData?.salaryRange
        );
        console.log('API响应数据:', response);
        console.log('API响应数据类型:', typeof response);
        console.log('API响应数据键:', Object.keys(response));
        if (response.data) {
          console.log('处理统计数据:', response.data);
          console.log('personalStats存在吗:', !!response.data.personalStats);
          console.log('personalStats内容:', response.data.personalStats);
          setStatsData({
            totalSubmissions: response.data.totalSubmissions || 0,
            offerRate: Math.round(response.data.offerRate || 0),
            avgOffers: Math.round((response.data.avgOffers || 0) * 10) / 10,
            todayNew: response.data.todayNew || 0
          });
          
          // 设置薪资分布数据
          if (response.data.salaryDistribution) {
            console.log('设置薪资分布数据:', response.data.salaryDistribution);
            setSalaryDistribution(response.data.salaryDistribution);
          }
          
          // 设置个人统计数据
          console.log('检查personalStats:', response.data.personalStats);
          if (response.data.personalStats) {
            console.log('设置个人统计数据:', response.data.personalStats);
            const newPersonalStats = {
              aboveAveragePercent: Math.round(response.data.personalStats.above_average_percent || 0),
              industryPercentile: Math.round(response.data.personalStats.industry_percentile || 0)
            };
            console.log('计算后的个人统计数据:', newPersonalStats);
            setPersonalStats(newPersonalStats);
          } else {
            console.log('没有个人统计数据');
          }
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
        message.error('获取统计数据失败，使用默认数据');
        // 使用默认数据
        setStatsData({
          totalSubmissions: 1300,
          offerRate: 68,
          avgOffers: 1.2,
          todayNew: 89
        });
      }
    };

    fetchStats();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleReset = () => {
    resetForm();
    navigate('/');
  };

  const handleGenerateReport = () => {
    // 生成报告逻辑
    console.log('生成报告');
  };

  const handleShare = () => {
    // 分享逻辑
    console.log('分享到小红书');
  };

  if (!submittedData) {
    return (
      <Row justify="center" style={{ padding: '40px 0' }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card style={{ textAlign: 'center', borderRadius: '16px' }}>
            <Empty
              description="暂无数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleBack}>
                返回填写表单
              </Button>
            </Empty>
          </Card>
        </Col>
      </Row>
    );
  }

  // 薪资分布图表配置
  const getSalaryDistributionOption = () => {
    console.log('当前薪资分布数据:', salaryDistribution);
    
    // 处理薪资分布数据 - 使用完整的薪资区间选项
    const salaryRanges = ['5-10K', '10-15K', '15-20K', '20-25K', '25-30K', '30-40K', '40-50K', '50K以上'];
    const distributionData = salaryRanges.map(range => {
      const found = salaryDistribution.find(item => item.salary_range === range);
      const count = found ? found.count : 0;
      console.log(`薪资区间 ${range}: ${count} 人`);
      return count;
    });
    
    console.log('处理后的分布数据:', distributionData);

    // 计算总人数用于百分比计算
    const totalCount = distributionData.reduce((sum, count) => sum + count, 0);
    const percentageData = distributionData.map(count => 
      totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    );

    return {
      title: {
        text: '薪资分布情况',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex;
          const count = distributionData[dataIndex];
          const percentage = percentageData[dataIndex];
          return `${params[0].name}<br/>人数: ${count}<br/>占比: ${percentage}%`;
        }
      },
      xAxis: {
        type: 'category',
        data: salaryRanges,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '人数'
      },
      series: [{
        data: distributionData,
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        },
        markPoint: {
          data: [
            { 
              type: 'max', 
              name: '最高',
              itemStyle: { color: '#ff6b6b' }
            }
          ]
        }
      }]
    };
  };

  // 获取用户薪资区间在分布中的位置
  const getUserSalaryPosition = (salaryRange: string) => {
    const ranges = ['5k-8k', '8k-12k', '12k-15k', '15k-20k', '20k-25k', '25k+'];
    const index = ranges.findIndex(range => range === salaryRange);
    if (index === -1) return 0;
    return index;
  };

  const userSalaryIndex = getUserSalaryPosition(submittedData.salaryRange);

  return (
    <div style={{ padding: '20px 0' }}>
      {/* 成功提示 */}
      <Row justify="center" style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={20} md={18} lg={16}>
          <Card 
            style={{ 
              textAlign: 'center',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Title level={2} style={{ color: 'white', margin: '16px 0' }}>
              🎉 数据提交成功！已解锁完整视图
            </Title>
          </Card>
        </Col>
      </Row>

      <Row justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={20} md={18} lg={16}>
          {/* 个人定位卡片 */}
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <Text strong>个人定位分析</Text>
              </Space>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none',
              marginBottom: '24px'
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  <Statistic
                    title="超越同专业同学"
                    value={personalStats.aboveAveragePercent || 0}
                    suffix="%"
                    valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                    prefix={<RiseOutlined />}
                  />
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '8px' }}>
                    调试: {personalStats.aboveAveragePercent || 0}% (状态: {JSON.stringify(personalStats)})
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  <Statistic
                    title="薪资处于行业前"
                    value={personalStats.industryPercentile || 0}
                    suffix="%"
                    valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                    prefix={<TrophyOutlined />}
                  />
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '8px' }}>
                    调试: {personalStats.industryPercentile || 0}% (状态: {JSON.stringify(personalStats)})
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 实时数据大盘 */}
          <Card 
            title={
              <Space>
                <DollarOutlined style={{ color: '#1890ff' }} />
                <Text strong>实时数据大盘</Text>
              </Space>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none',
              marginBottom: '24px'
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
                  <Statistic
                    title="数据总量"
                    value={statsData.totalSubmissions}
                    suffix="条"
                    valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
                  <Statistic
                    title="有Offer率"
                    value={statsData.offerRate}
                    suffix="%"
                    valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
                  <Statistic
                    title="人均Offer"
                    value={statsData.avgOffers}
                    valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
                  <Statistic
                    title="今日新增"
                    value={statsData.todayNew}
                    valueStyle={{ color: '#eb2f96', fontSize: '20px' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 薪资分布直方图 */}
          <Card 
            title={
              <Space>
                <BankOutlined style={{ color: '#1890ff' }} />
                <Text strong>薪资分布直方图</Text>
              </Space>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none',
              marginBottom: '24px'
            }}
          >
            <ReactECharts 
              option={getSalaryDistributionOption()} 
              style={{ height: '300px', width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Text type="secondary">
                你的薪资区间 <Text strong style={{ color: '#1890ff' }}>{submittedData.salaryRange}</Text> 处于行业前列
              </Text>
            </div>
          </Card>

          {/* 分享引导 */}
          <Card 
            title={
              <Space>
                <ShareAltOutlined style={{ color: '#1890ff' }} />
                <Text strong>分享你的秋招成果</Text>
              </Space>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none',
              textAlign: 'center'
            }}
          >
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                icon={<FileTextOutlined />}
                onClick={handleGenerateReport}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '48px',
                  padding: '0 24px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                生成我的秋招报告
              </Button>
              <Button 
                size="large"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                style={{
                  borderRadius: '8px',
                  height: '48px',
                  padding: '0 24px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                分享到小红书
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
      
      {/* 底部操作按钮 */}
      <Row justify="center" style={{ marginTop: '32px' }}>
        <Col>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            size="large"
            style={{
              borderRadius: '8px',
              height: '48px',
              padding: '0 24px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            返回重新填写
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
