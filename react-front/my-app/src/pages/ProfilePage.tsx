import React from 'react';
import { Card, Row, Col, Avatar, Typography, Descriptions, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ProfilePage: React.FC = () => {
  return (
    <Row justify="center" style={{ padding: '20px 0' }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card 
          title={
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0 }}>
                个人资料
              </Title>
            </div>
          }
          style={{ 
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: 'none'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                marginBottom: '16px'
              }}
            />
            <Title level={3} style={{ margin: '16px 0 8px 0' }}>
              用户昵称
            </Title>
            <Paragraph type="secondary">
              这是个人资料页面，您可以在这里管理个人信息
            </Paragraph>
          </div>
          
          <Descriptions 
            title="基本信息" 
            bordered 
            column={1}
            style={{ marginBottom: '24px' }}
          >
            <Descriptions.Item label="用户名">offer_user</Descriptions.Item>
            <Descriptions.Item label="邮箱">user@example.com</Descriptions.Item>
            <Descriptions.Item label="注册时间">2024-01-01</Descriptions.Item>
            <Descriptions.Item label="最后登录">2024-10-21</Descriptions.Item>
          </Descriptions>
          
          <div style={{ textAlign: 'center' }}>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              编辑资料
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage;
