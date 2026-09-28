import React from 'react';
import { BarChart3, Users, FileText, Truck, TrendingUp, DollarSign } from 'lucide-react';
import Card from '../ui/Card';

interface DashboardStats {
  pendingQuotes: number;
  activeDrivers: number;
  activeLoads: number;
  monthlyRevenue: number;
}

interface DashboardOverviewProps {
  stats?: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  stats = {
    pendingQuotes: 0,
    activeDrivers: 0,
    activeLoads: 0,
    monthlyRevenue: 0
  }
}) => {
  const statItems = [
    { 
      title: 'Pending Quotes', 
      value: stats.pendingQuotes.toString(), 
      icon: FileText, 
      change: '+12%', 
      color: 'text-blue-400' 
    },
    { 
      title: 'Active Drivers', 
      value: stats.activeDrivers > 0 ? stats.activeDrivers.toString() : '1,847', 
      icon: Users, 
      change: '+5.2%', 
      color: 'text-green-400' 
    },
    { 
      title: 'Active Loads', 
      value: stats.activeLoads.toString(), 
      icon: Truck, 
      change: '+8.1%', 
      color: 'text-purple-400' 
    },
    { 
      title: 'Monthly Revenue', 
      value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`, 
      icon: DollarSign, 
      change: '+15.3%', 
      color: 'text-red-400' 
    },
  ];

  const recentQuotes = [
    { id: 'Q001', company: 'ABC Manufacturing', route: 'Dallas, TX → Los Angeles, CA', status: 'Pending', amount: '$2,450' },
    { id: 'Q002', company: 'XYZ Logistics', route: 'Houston, TX → Miami, FL', status: 'Approved', amount: '$1,890' },
    { id: 'Q003', company: 'Tech Solutions', route: 'Austin, TX → Seattle, WA', status: 'Pending', amount: '$3,200' },
    { id: 'Q004', company: 'Food Distributors', route: 'San Antonio, TX → Denver, CO', status: 'Rejected', amount: '$1,650' },
  ];

  const recentDrivers = [
    { id: 'D001', name: 'John Smith', location: 'Dallas, TX', experience: '5 years', status: 'Under Review' },
    { id: 'D002', name: 'Maria Garcia', location: 'Houston, TX', experience: '8 years', status: 'Approved' },
    { id: 'D003', name: 'Robert Johnson', location: 'Austin, TX', experience: '3 years', status: 'Pending' },
    { id: 'D004', name: 'Lisa Chen', location: 'Fort Worth, TX', experience: '12 years', status: 'Approved' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'under review':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <div className="bg-red-primary/10 p-3 rounded-lg">
                  <IconComponent className="h-6 w-6 text-red-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
          <div className="h-64 bg-dark-tertiary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">Chart placeholder</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Load Distribution</h3>
          <div className="h-64 bg-dark-tertiary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">Chart placeholder</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Recent Quote Requests</h3>
          <div className="space-y-4">
            {recentQuotes.map((quote, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                <div>
                  <p className="text-white font-medium">{quote.company}</p>
                  <p className="text-gray-400 text-sm">{quote.route}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{quote.amount}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Recent Driver Applications</h3>
          <div className="space-y-4">
            {recentDrivers.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                <div>
                  <p className="text-white font-medium">{driver.name}</p>
                  <p className="text-gray-400 text-sm">{driver.location} • {driver.experience}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(driver.status)}`}>
                  {driver.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;