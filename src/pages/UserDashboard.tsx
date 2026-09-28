import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, FileText, User, Phone, Mail, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchQuotes();
  }, [user, navigate]);
  
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      
      // Fetch quotes by user_id or email
      const { data, error: fetchError } = await supabase
        .from('quote_requests')
        .select('*')
        .or(`user_id.eq.${user?.id},email.eq.${user?.email}`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (fetchError) {
        console.error('Error fetching quotes:', fetchError);
        setError('Failed to load your quotes. Please try again later.');
        return;
      }
      
      setQuotes(data || []);
    } catch (err) {
      console.error('Error in fetchQuotes:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Package,
      title: 'Request Quote',
      description: 'Get pricing for your shipping needs',
      href: '/quote',
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      icon: FileText,
      title: 'Track Shipment',
      description: 'Monitor your active shipments',
      href: '/track',
      color: 'bg-green-500/10 text-green-400',
    },
    {
      icon: User,
      title: 'Join as Driver',
      description: 'Apply to become a driver',
      href: '/join-driver',
      color: 'bg-purple-500/10 text-purple-400',
    },
    {
      icon: Phone,
      title: 'Contact Support',
      description: '24/7 customer support',
      href: '/contact',
      color: 'bg-red-500/10 text-red-400',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'in transit':
        return 'bg-blue-500/20 text-blue-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-dark-primary pt-16">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your shipments and track your logistics needs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Back to Website
              </Link>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <Card hover className="text-center h-full">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${action.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Quotes */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Recent Quote Requests {quotes.length > 0 && <span className="text-sm text-gray-400">({quotes.length})</span>}
                </h3>
                <Link to="/quote">
                  <Button variant="outline" size="sm">
                    New Quote
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Loading your quotes...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">{error}</p>
                    <Button onClick={fetchQuotes} className="mt-4">Retry</Button>
                  </div>
                ) : quotes.length > 0 ? (
                  quotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="text-white font-medium">{quote.id.slice(0, 8)}</p>
                      <p className="text-gray-400 text-sm">{quote.pickup_location} → {quote.delivery_location}</p>
                      <p className="text-gray-500 text-xs">{formatDate(quote.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {quote.amount ? `$${quote.amount}` : 'Pending Quote'}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No quote requests yet</p>
                    <Link to="/quote">
                      <Button className="mt-4">Request Your First Quote</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Account Info & Support */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{user?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">Customer since 2024</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Edit Profile
              </Button>
            </Card>

            {/* Support */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-red-primary" />
                  <div>
                    <p className="text-white text-sm font-medium">24/7 Support</p>
                    <p className="text-gray-400 text-xs">407-777-2772</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-red-primary" />
                  <div>
                    <p className="text-white text-sm font-medium">Email Support</p>
                    <p className="text-gray-400 text-xs">support@bosaboss.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-red-primary" />
                  <div>
                    <p className="text-white text-sm font-medium">Response Time</p>
                    <p className="text-gray-400 text-xs">Within 2 hours</p>
                  </div>
                </div>
              </div>
              <Link to="/contact">
                <Button className="w-full mt-4">
                  Contact Support
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;