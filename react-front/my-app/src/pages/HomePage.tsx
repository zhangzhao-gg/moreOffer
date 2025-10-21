import React from 'react';
import { Card, Form, Input, InputNumber, Button, Row, Col, Select, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { OfferData } from '../types';
import { INDUSTRY_OPTIONS, SALARY_OPTIONS } from '../utils/testData';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, submitForm, isSubmitting } = useAppStore();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleSubmit = async (values: OfferData) => {
    try {
      // 确保 offerCount 是有效的数字类型
      const offerCount = Number(values.offerCount);
      if (isNaN(offerCount) || offerCount < 0) {
        message.error('请输入有效的Offer数量');
        return;
      }
      
      const submitData = {
        ...values,
        offerCount: offerCount
      };
      console.log('准备提交的数据:', submitData);
      await submitForm(submitData);
      message.success('数据提交成功！');
      navigate('/dashboard');
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };

  const handleValuesChange = (changedValues: Partial<OfferData>) => {
    updateFormData(changedValues);
  };

  return (
    <Row justify="center" style={{ padding: '20px 0' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card 
          title={
            <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              Offer透透
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
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            initialValues={formData}
            size="large"
          >
            <Form.Item
              label="当前Offer数量"
              name="offerCount"
              rules={[
                { required: true, message: '请输入Offer数量' },
                { type: 'number', min: 0, message: '数量不能小于0' }
              ]}
            >
              <InputNumber
                placeholder="请输入Offer数量"
                style={{ width: '100%' }}
                min={0}
                defaultValue={0}
              />
            </Form.Item>

            <Form.Item
              label="薪资区间"
              name="salaryRange"
              rules={[
                { required: true, message: '请选择薪资区间' }
              ]}
            >
              <Select
                placeholder="请选择薪资区间"
                size="large"
                options={SALARY_OPTIONS.map(option => ({ label: option, value: option }))}
                showSearch
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="所在行业"
              name="industry"
              rules={[
                { required: true, message: '请选择所在行业' }
              ]}
            >
              <Select
                placeholder="请选择所在行业"
                size="large"
                options={INDUSTRY_OPTIONS.map(option => ({ label: option, value: option }))}
                showSearch
                allowClear
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                size="large"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {isSubmitting ? '提交中...' : '提交数据'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default HomePage;
