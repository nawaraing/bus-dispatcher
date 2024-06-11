import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import Logout from './Logout';
import DispatchPage from './DispatchPage';

// 추가된 CSS 파일들
import './assets/vendor/fonts/boxicons.css';
import './assets/img/favicon/favicon.ico';
import './assets/vendor/css/core.css';
import './assets/vendor/css/Dispatch.css';
import './assets/vendor/css/SidebarModal.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import './assets/vendor/css/pages/page-auth.css';
import './assets/vendor/js/helpers.js';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/dispatch" element={<DispatchPage />} />
    </Routes>
  </Router>
);

root.render(<App />);
