import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import InvestigatePage from './pages/InvestigatePage';
import ReportPage from './pages/ReportPage';
import WeatherPage from './pages/WeatherPage';
import ActionsPage from './pages/ActionsPage';
import AssistantPage from './pages/AssistantPage';
import HistoryPage from './pages/HistoryPage';
import { ToastProvider } from './components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Core App with Shared MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/investigate" element={<InvestigatePage />} />
            <Route path="/report/:id" element={<ReportPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/actions" element={<ActionsPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
