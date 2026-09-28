import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ServiceFeature {
  [key: string]: any;
}

interface Service {
  id: string | null;
  title: string;
  description: string;
  category: 'trucking' | 'dispatching';
  features: string[] | ServiceFeature[];
  price: string;
  isActive: boolean | undefined;
  is_active?: boolean;
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Full Truckload (FTL)',
      description: 'Dedicated trucks for your exclusive cargo with priority scheduling and faster transit times.',
      category: 'trucking',
      features: ['Direct delivery', 'Reduced handling', 'Faster transit', 'Priority scheduling'],
      price: 'Custom Quote',
      isActive: true,
    },
    {
      id: '2',
      title: 'Less Than Truckload (LTL)',
      description: 'Cost-effective shipping for smaller loads with consolidated transportation.',
      category: 'trucking',
      features: ['Cost-effective', 'Flexible scheduling', 'Terminal services', 'Shared transport'],
      price: 'Starting at $0.85/mile',
      isActive: true,
    },
    {
      id: '3',
      title: '24/7 Dispatch Support',
      description: 'Round-the-clock assistance for drivers with experienced dispatch professionals.',
      category: 'dispatching',
      features: ['24/7 availability', 'Emergency support', 'Route planning', 'Problem resolution'],
      price: '$500/month',
      isActive: true,
    },
    {
      id: '4',
      title: 'Load Board Management',
      description: 'Access to premium load boards with high-paying freight opportunities.',
      category: 'dispatching',
      features: ['Multiple load boards', 'Real-time updates', 'Rate optimization', 'Credit checks'],
      price: '$300/month',
      isActive: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'trucking' as 'trucking' | 'dispatching',
    features: [''],
    price: '',
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
    
    const subscription = supabase
      .channel('services_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'services' 
      }, () => {
        fetchServices();
      })
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching services:', fetchError);
        setError('Failed to load services. Please try again.');
        
        // Fall back to initial services if database fetch fails
        setServices(initialServices);
        return;
      }
      
      // Map database services to component format
      if (data && data.length > 0) {
        const mappedServices = data.map(service => ({
          id: service.id,
          title: service.name,
          description: service.description,
          category: service.category,
          features: Array.isArray(service.features) ? service.features : [],
          price: service.price || '',
          isActive: service.is_active
        }));
        setServices(mappedServices);
      } else {
        setServices(initialServices);
      }
    } catch (err) {
      console.error('Error in fetchServices:', err);
      setError('An unexpected error occurred. Using default services.');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setError('');
    setSuccessMessage('');
    
    setFormData({
      title: service.title || '',
      description: service.description || '',
      category: service.category || 'trucking',
      features: Array.isArray(service.features) ? 
        service.features.map(f => typeof f === 'string' ? f : JSON.stringify(f)) : 
        [],
      price: service.price || '',
      isActive: service.isActive ?? service.is_active ?? true
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSuccessMessage('');
    setFormData({
      title: '',
      description: '',
      category: 'trucking',
      features: [''],
      price: '',
      isActive: true,
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError('');
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Service title is required');
      setSuccessMessage('');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      setSuccessMessage('');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.category) {
      setError('Category is required');
      setSuccessMessage('');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const serviceData = {
        name: formData.title,
        description: formData.description,
        category: formData.category,
        features: formData.features,
        price: formData.price,
        is_active: formData.isActive
      };
      
      if (editingService) {
        // Update existing service
        console.log('Updating service:', editingService.id, serviceData);
        const { error: updateError } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
          
        if (updateError) {
          console.error('Error updating service:', updateError);
          setError('Failed to update service. Please try again.');
          setSuccessMessage('');
          return;
        }
        
        setSuccessMessage('Service updated successfully!');
      } else if (isCreating) {
        // Create new service
        console.log('Creating new service:', serviceData);
        const { error: insertError } = await supabase
          .from('services')
          .insert(serviceData);
          
        if (insertError) {
          console.error('Error creating service:', insertError);
          setError('Failed to create service. Please try again.');
          setSuccessMessage('');
          return;
        }
        
        setSuccessMessage('Service created successfully!');
      }
      
      // Refresh services list
      console.log('Refreshing services list');
      await fetchServices();
      
      // Reset form and state
      setEditingService(null);
      setIsCreating(false);
      resetForm();
      
    } catch (err) {
      console.error('Error saving service:', err);
      setError('An unexpected error occurred. Please try again.');
      setSuccessMessage('');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
    
    // Fallback to client-side update if database operations fail
    if (editingService) {
      // Update existing service
      setServices(prev => prev.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData }
          : service
      ));
      setEditingService(null);
    } else if (isCreating) {
      // Create new service
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
      };
      setServices(prev => [...prev, newService]);
      setIsCreating(false);
    }
    resetForm();
  };

  const handleCancel = () => {
    setEditingService(null);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'trucking',
      features: [''],
      price: '',
      isActive: true,
    });
  };

  const handleDelete = async (serviceId: string | null) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        setError('');
        
        if (serviceId) {
          const { error: deleteError } = await supabase
            .from('services')
            .delete()
            .eq('id', serviceId);
            
          if (deleteError) {
            console.error('Error deleting service:', deleteError);
            setError('Failed to delete service. Please try again.');
            return;
          }
          
          // Refresh services list
          await fetchServices();
        } else {
          // Fallback to client-side delete if no ID
          setServices(prev => prev.filter(service => service.id !== serviceId));
        }
      } catch (err) {
        console.error('Error deleting service:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Services Management</h2>
          <p className="text-gray-400">Manage your trucking and dispatching services</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
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
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="trucking">Trucking Services</option>
            <option value="dispatching">Dispatching Services</option>
          </select>
        </div>
      </Card>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Service Form */}
      {(editingService || isCreating) && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">
              {editingService ? 'Edit Service' : 'Create New Service'}
            </h3>
            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Service Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Category <span className="text-red-primary">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'trucking' | 'dispatching' }))}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
              >
                <option value="trucking">Trucking Services</option>
                <option value="dispatching">Dispatching Services</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-primary">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
                required
              />
            </div>

            <Input
              label="Price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="e.g., $500/month or Custom Quote"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-600 text-red-primary focus:ring-red-primary"
                />
                <span className="text-gray-300">Active</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1 px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-red-primary hover:text-red-400 text-sm"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    service.isActive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.category === 'trucking' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {service.category === 'trucking' ? 'Trucking' : 'Dispatching'}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-blue-400 hover:text-blue-300 p-1"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-400 mb-4 text-sm">{service.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Features:</h4>
              <ul className="space-y-1">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-red-primary rounded-full mr-2"></div>
                    {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-sm">
              <span className="text-gray-400">Price: </span>
              <span className="text-white font-semibold">{service.price}</span>
            </div>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">No services found matching your criteria.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ServicesManagement;