import React from 'react';
import { Card, Row, Col, Form, Switch, Select, Button, Typography, Divider } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSave = (values: any) => {
    console.log('保存设置:', values);
  };

  return (
    <Row justify="center" style={{ padding: '20px 0' }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card 
          title={
            <div style={{ textAlign: 'center' }}>
              <SettingOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <Title level={2} style={{ margin: 0, display: 'inline' }}>
                系统设置
              </Title>
            </div>
          }
          style={{ 
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: 'none'
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              notifications: true,
              theme: 'light',
              language: 'zh-CN'
            }}
          >
            <Title level={4}>通知设置</Title>
            <Form.Item
              label="邮件通知"
              name="emailNotifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item
              label="推送通知"
              name="pushNotifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Divider />

            <Title level={4}>界面设置</Title>
            <Form.Item
              label="主题模式"
              name="theme"
            >
              <Select>
                <Option value="light">浅色模式</Option>
                <Option value="dark">深色模式</Option>
                <Option value="auto">跟随系统</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="语言设置"
              name="language"
            >
              <Select>
                <Option value="zh-CN">简体中文</Option>
                <Option value="en-US">English</Option>
                <Option value="ja-JP">日本語</Option>
              </Select>
            </Form.Item>

            <Divider />

            <Title level={4}>数据设置</Title>
            <Form.Item
              label="自动保存"
              name="autoSave"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="数据同步"
              name="dataSync"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center', marginTop: '32px' }}>
              <Button 
                type="primary" 
                htmlType="submit"
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
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default SettingsPage;
