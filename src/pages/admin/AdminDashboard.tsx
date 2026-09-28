import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import DashboardOverview from '../../components/admin/DashboardOverview';
import QuotesManagement from '../../components/admin/QuotesManagement';
import DriversManagement from '../../components/admin/DriversManagement';
import ServicesManagement from '../../components/admin/ServicesManagement';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    pendingQuotes: 0,
    activeDrivers: 0,
    activeLoads: 0,
    monthlyRevenue: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    } else if (!isLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      // Get pending quotes count
      const { data: pendingQuotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('count')
        .eq('status', 'pending');
      
      if (!quotesError && pendingQuotes && pendingQuotes[0]) {
        setDashboardStats(prev => ({
          ...prev,
          pendingQuotes: pendingQuotes[0].count || 0
        }));
      }
      
      // Get driver applications count
      const { data: drivers, error: driversError } = await supabase
        .from('driver_applications')
        .select('count');
      
      if (!driversError && drivers && drivers[0]) {
        setDashboardStats(prev => ({
          ...prev,
          activeDrivers: drivers[0].count || 0
        }));
      }
      
      // For demo purposes, set some placeholder values
      setDashboardStats(prev => ({
        ...prev,
        activeLoads: 156,
        monthlyRevenue: 847000
      }));
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardOverview stats={dashboardStats} />} />
            <Route path="/quotes" element={<QuotesManagement />} />
            <Route path="/drivers" element={<DriversManagement />} />
            <Route path="/services" element={<ServicesManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;