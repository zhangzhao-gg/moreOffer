import React from 'react';
import { Card, Row, Col, Statistic, Button, Empty, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  TrophyOutlined, 
  DollarOutlined, 
  BankOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { submittedData, resetForm } = useAppStore();

  const handleBack = () => {
    navigate('/');
  };

  const handleReset = () => {
    resetForm();
    navigate('/');
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

  return (
    <div style={{ padding: '20px 0' }}>
      <Row justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={20} md={18} lg={16}>
          <Card 
            title={
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                  数据看板
                </Title>
              </div>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none',
              marginBottom: '24px'
            }}
            extra={
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBack}
                type="default"
              >
                返回
              </Button>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                        <TrophyOutlined style={{ marginRight: '8px' }} />
                        当前Offer数量
                      </span>
                    }
                    value={submittedData.offerCount}
                    valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                    suffix="个"
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={8}>
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
                    title={
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                        <DollarOutlined style={{ marginRight: '8px' }} />
                        薪资区间
                      </span>
                    }
                    value={submittedData.salaryRange}
                    valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={8}>
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
                    title={
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                        <BankOutlined style={{ marginRight: '8px' }} />
                        所在行业
                      </span>
                    }
                    value={submittedData.industry}
                    valueStyle={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      <Row justify="center" style={{ marginTop: '24px' }}>
        <Col>
          <Button 
            type="primary" 
            size="large"
            onClick={handleReset}
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none',
              borderRadius: '8px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            重新填写表单
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
