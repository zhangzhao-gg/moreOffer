import React from 'react';
import { Layout, Menu, Typography, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, ROUTE_NAMES } from '../../utils/routes';
import { useAppStore } from '../../store/useAppStore';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetForm } = useAppStore();

  const menuItems = [
    {
      key: ROUTES.HOME,
      label: ROUTE_NAMES[ROUTES.HOME],
    },
    {
      key: ROUTES.DASHBOARD,
      label: ROUTE_NAMES[ROUTES.DASHBOARD],
    },
    {
      key: ROUTES.PROFILE,
      label: ROUTE_NAMES[ROUTES.PROFILE],
    },
    {
      key: ROUTES.SETTINGS,
      label: ROUTE_NAMES[ROUTES.SETTINGS],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleReset = () => {
    resetForm();
    navigate(ROUTES.HOME);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Offer透透
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ 
              background: 'transparent',
              border: 'none',
              minWidth: '400px'
            }}
          />
          <Button 
            type="primary" 
            ghost 
            onClick={handleReset}
            style={{ 
              background: 'rgba(255,255,255,0.2)',
              borderColor: 'white',
              color: 'white'
            }}
          >
            重置表单
          </Button>
        </div>
      </Header>
      
      <Content style={{ 
        padding: '24px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: 'calc(100vh - 64px - 70px)'
      }}>
        {children}
      </Content>
      
      <Footer style={{ 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        Offer透透 ©2024 Created with React + Ant Design
      </Footer>
    </Layout>
  );
};

export default MainLayout;
