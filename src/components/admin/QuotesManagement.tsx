import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Trash2, Plus, Download, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface QuoteRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  pickup_location: string;
  delivery_location: string;
  cargo_type: string;
  weight: string | null;
  pickup_date: string | null;
  status: 'pending' | 'approved' | 'rejected';
  amount: number | null;
  created_at: string;
}

const QuotesManagement: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchQuotes();
    
    const subscription = supabase
      .channel('quote_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'quote_requests' 
      }, () => {
        fetchQuotes();
      })
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        return;
      }

      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      console.log('Updating quote status:', id, status);
      
      const { error } = await supabase
        .from('quote_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating quote:', error);
        setSuccessMessage('');
        return;
      }

      // Update local state
      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, status } : quote
      ));
      
      setSuccessMessage(`Quote status updated to ${status} successfully!`);
    } catch (error) {
      console.error('Error updating quote:', error);
      setSuccessMessage('');
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    
    console.log('Deleting quote:', id);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting quote:', error);
        setSuccessMessage('');
        return;
      }

      setQuotes(prev => prev.filter(quote => quote.id !== id));
      setSuccessMessage('Quote deleted successfully!');
    } catch (error) {
      console.error('Error deleting quote:', error);
      setSuccessMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleSelectAll = () => {
    setSelectedQuotes(
      selectedQuotes.length === filteredQuotes.length 
        ? [] 
        : filteredQuotes.map(quote => quote.id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading quotes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Quote Management</h2>
          <p className="text-gray-400">Manage and track all quote requests</p>
        </div>
        <Button onClick={fetchQuotes}>
          <Plus className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Quotes Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-600 text-red-primary focus:ring-red-primary"
                  />
                </th>
                <th className="text-left text-gray-300 py-3 px-4">Quote ID</th>
                <th className="text-left text-gray-300 py-3 px-4">Company</th>
                <th className="text-left text-gray-300 py-3 px-4">Route</th>
                <th className="text-left text-gray-300 py-3 px-4">Cargo</th>
                <th className="text-left text-gray-300 py-3 px-4">Status</th>
                <th className="text-left text-gray-300 py-3 px-4">Date</th>
                <th className="text-left text-gray-300 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-800 hover:bg-dark-tertiary/50">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.includes(quote.id)}
                      onChange={() => handleSelectQuote(quote.id)}
                      className="rounded border-gray-600 text-red-primary focus:ring-red-primary"
                    />
                  </td>
                  <td className="py-4 px-4 text-white font-medium">{quote.id.slice(0, 8)}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{quote.company_name}</p>
                      <p className="text-gray-400 text-sm">{quote.contact_name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    <div className="text-sm">
                      <p>{quote.pickup_location}</p>
                      <p className="text-gray-500">→ {quote.delivery_location}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-white">{quote.cargo_type}</p>
                      <p className="text-gray-400">{quote.weight || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 p-1" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      {quote.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateQuoteStatus(quote.id, 'approved')}
                            className="text-green-400 hover:text-green-300 p-1" 
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                            className="text-red-400 hover:text-red-300 p-1" 
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => deleteQuote(quote.id)}
                        className="text-red-400 hover:text-red-300 p-1" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No quotes found matching your criteria.</p>
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedQuotes.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-white">
              {selectedQuotes.length} quote{selectedQuotes.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Approve Selected
              </Button>
              <Button variant="outline" size="sm">
                Reject Selected
              </Button>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuotesManagement;