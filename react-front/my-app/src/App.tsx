import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/Layout/MainLayout';
import ErrorBoundary from './components/Common/ErrorBoundary';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { ROUTES } from './utils/routes';
import { THEME_CONFIG } from './utils/constants';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: THEME_CONFIG.PRIMARY_COLOR,
            borderRadius: 8,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
          components: {
            Layout: {
              headerBg: 'transparent',
              bodyBg: 'transparent',
            },
            Card: {
              borderRadiusLG: 16,
            },
            Button: {
              borderRadius: 8,
            },
          },
        }}
      >
        <AntdApp>
          <Router>
            <MainLayout>
              <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          </Router>
        </AntdApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
