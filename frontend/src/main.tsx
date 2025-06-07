// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import {userService} from './services'
import './index.css'

// Khởi tạo action object - giả sử đây là store hoặc state manager của bạn
const action = {
  clearAuthentication: () => {
    console.log('Clearing authentication data');
    // Logic xóa dữ liệu xác thực
  },
  clearSearchInfo: () => {
    console.log('Clearing search info');
    // Logic xóa thông tin tìm kiếm
  },
  clearSitesMap: () => {
    console.log('Clearing sites map');
    // Logic xóa dữ liệu bản đồ site
  }
};

// Hàm render ứng dụng sau khi Keycloak đã khởi tạo
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Khởi tạo Keycloak trước khi render ứng dụng
userService.initKeycloak(renderApp, () => {
  action.clearAuthentication();
  action.clearSearchInfo();
  action.clearSitesMap();
});