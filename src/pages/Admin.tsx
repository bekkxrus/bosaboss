import React, { useState } from 'react';
import { BarChart3, Users, FileText, Truck, Mail, Edit, Trash2, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'drivers' | 'services' | 'blog'>('dashboard');

  const stats = [
    { title: 'Pending Quotes', value: '24', icon: FileText, change: '+12%' },
    { title: 'Active Drivers', value: '1,847', icon: Users, change: '+5.2%' },
    { title: 'Active Loads', value: '156', icon: Truck, change: '+8.1%' },
    { title: 'Monthly Revenue', value: '$847K', icon: BarChart3, change: '+15.3%' },
  ];

  const recentQuotes = [
    { id: 'Q001', company: 'ABC Manufacturing', route: 'Dallas, TX → Los Angeles, CA', status: 'Pending', amount: '$2,450' },
    { id: 'Q002', company: 'XYZ Logistics', route: 'Houston, TX → Miami, FL', status: 'Approved', amount: '$1,890' },
    { id: 'Q003', company: 'Tech Solutions', route: 'Austin, TX → Seattle, WA', status: 'Pending', amount: '$3,200' },
    { id: 'Q004', company: 'Food Distributors', route: 'San Antonio, TX → Denver, CO', status: 'Rejected', amount: '$1,650' },
  ];

  const driverApplications = [
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

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className="bg-red-primary/10 p-3 rounded-lg">
                  <IconComponent className="h-6 w-6 text-red-primary" />
                </div>
              </div>
            </Card>
          );
        })}
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
          <h3 className="text-lg font-semibold text-white mb-6">Driver Applications</h3>
          <div className="space-y-4">
            {driverApplications.map((driver, index) => (
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

  const renderQuotes = () => (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Quote Management</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-300 pb-3">Quote ID</th>
              <th className="text-left text-gray-300 pb-3">Company</th>
              <th className="text-left text-gray-300 pb-3">Route</th>
              <th className="text-left text-gray-300 pb-3">Amount</th>
              <th className="text-left text-gray-300 pb-3">Status</th>
              <th className="text-left text-gray-300 pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentQuotes.map((quote, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="py-4 text-white">{quote.id}</td>
                <td className="py-4 text-white">{quote.company}</td>
                <td className="py-4 text-gray-400">{quote.route}</td>
                <td className="py-4 text-white font-semibold">{quote.amount}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderDrivers = () => (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Driver Applications</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-300 pb-3">Driver ID</th>
              <th className="text-left text-gray-300 pb-3">Name</th>
              <th className="text-left text-gray-300 pb-3">Location</th>
              <th className="text-left text-gray-300 pb-3">Experience</th>
              <th className="text-left text-gray-300 pb-3">Status</th>
              <th className="text-left text-gray-300 pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {driverApplications.map((driver, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="py-4 text-white">{driver.id}</td>
                <td className="py-4 text-white">{driver.name}</td>
                <td className="py-4 text-gray-400">{driver.location}</td>
                <td className="py-4 text-gray-400">{driver.experience}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'services', label: 'Services', icon: Truck },
    { id: 'blog', label: 'Blog', icon: Mail },
  ];

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-12 bg-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            Admin <span className="text-red-primary">Dashboard</span>
          </h1>
          <p className="text-gray-300 mt-2">Manage quotes, drivers, services, and content</p>
        </div>
      </section>

      {/* Admin Interface */}
      <section className="py-12 bg-dark-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <Card className="sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-red-primary text-white'
                            : 'text-gray-300 hover:bg-dark-tertiary hover:text-white'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'quotes' && renderQuotes()}
              {activeTab === 'drivers' && renderDrivers()}
              {activeTab === 'services' && (
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Service Management</h3>
                  <p className="text-gray-400">Service management interface would go here.</p>
                </Card>
              )}
              {activeTab === 'blog' && (
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Blog Management</h3>
                  <p className="text-gray-400">Blog post management interface would go here.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;