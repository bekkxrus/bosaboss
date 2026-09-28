import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, Eye, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
  publish_date: string;
  read_time: string;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string;
}

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    status: 'draft' as 'draft' | 'published',
    publish_date: '',
    read_time: '',
    featured_image_url: '',
  });

  const categories = ['Technology', 'Safety', 'Business', 'Dispatch', 'Maintenance', 'Compliance'];

  // Fetch posts from database
  useEffect(() => {
    const fetchData = async () => {
      await fetchPosts();
    };
    
    fetchData();
    
    // Set up real-time subscription for blog posts
    const subscription = supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'blog_posts' 
      }, async () => {
        await fetchPosts();
      })
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts');
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      status: post.status,
      publish_date: post.publish_date,
      read_time: post.read_time,
      featured_image_url: post.featured_image_url || '',
    });
    setPreviewMode(false);
    setError('');
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      status: 'draft',
      publish_date: new Date().toISOString().split('T')[0],
      read_time: '',
      featured_image_url: '',
    });
    setPreviewMode(false);
    setError('');
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError('Please fill in all required fields (title, excerpt, content, author)');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    console.log('Saving blog post:', formData);

    try {
      const postData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        category: formData.category,
        status: formData.status,
        publish_date: formData.publish_date,
        read_time: formData.read_time || null,
        featured_image_url: formData.featured_image_url || null,
      };

      if (editingPost) {
        // Update existing post
        console.log('Updating existing post:', editingPost.id);
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating blog post:', error);
          setError('Failed to update blog post');
          setSuccessMessage('');
          return;
        }

        // Update local state
        setPosts(prev => prev.map(post => 
          post.id === editingPost.id ? data : post
        ));
        setSuccessMessage('Blog post updated successfully!');
        
        setEditingPost(null);
      } else if (isCreating) {
        // Create new post
        console.log('Creating new post');
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(postData)
          .select()
          .single();

        if (error) {
          console.error('Error creating blog post:', error);
          setError('Failed to create blog post');
          setSuccessMessage('');
          return;
        }

        // Add to local state
        setPosts(prev => [data, ...prev]);
        setSuccessMessage('Blog post created successfully!');
        setIsCreating(false);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
      setError('Failed to save blog post');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
    setIsCreating(false);
    setPreviewMode(false);
    setError('');
    setSuccessMessage('');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      status: 'draft',
      publish_date: '',
      read_time: '',
      featured_image_url: '',
    });
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      console.log('Delete cancelled');
      return;
    }
    
    console.log('Deleting blog post:', postId);

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting blog post:', error);
        setError('Failed to delete blog post');
        setSuccessMessage('');
        return;
      }

      // Remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
      setSuccessMessage('Blog post deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setError('Failed to delete blog post');
      setSuccessMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-green-500/20 text-green-400' 
      : 'bg-yellow-500/20 text-yellow-400';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Technology: 'bg-blue-500/20 text-blue-400',
      Safety: 'bg-green-500/20 text-green-400',
      Business: 'bg-purple-500/20 text-purple-400',
      Dispatch: 'bg-orange-500/20 text-orange-400',
      Maintenance: 'bg-yellow-500/20 text-yellow-400',
      Compliance: 'bg-red-500/20 text-red-400',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Blog Management</h2>
          <p className="text-gray-400">Create and manage blog posts</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Blog Editor */}
      {(editingPost || isCreating) && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          {!previewMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Excerpt <span className="text-red-primary">*</span>
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
                    placeholder="Brief description of the post..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Content (Markdown) <span className="text-red-primary">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={20}
                    className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none font-mono text-sm"
                    placeholder="Write your blog post content in Markdown..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Status <span className="text-red-primary">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <Input
                  label="Author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Category <span className="text-red-primary">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Publish Date"
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                  required
                />

                <Input
                  label="Read Time"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                  placeholder="e.g., 5 min read"
                />

                <Input
                  label="Featured Image URL"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white mb-4">{formData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{formData.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formData.publish_date}</span>
                </div>
                <span>{formData.read_time}</span>
                {formData.category && (
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(formData.category)}`}>
                    {formData.category}
                  </span>
                )}
              </div>
              {formData.featured_image_url && (
                <img src={formData.featured_image_url} alt={formData.title} className="w-full h-64 object-cover rounded-lg mb-6" />
              )}
              <p className="text-lg text-gray-300 mb-6">{formData.excerpt}</p>
              <div className="text-gray-300">
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Filters */}
      {!editingPost && !isCreating && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </Card>
      )}

      {/* Posts List */}
      {!editingPost && !isCreating && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="group">
              {post.featured_image_url && (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
              )}
              
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-red-primary transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-400 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.publish_date}</span>
                  </div>
                </div>
                <span>{post.read_time}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-400 hover:text-blue-300 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!editingPost && !isCreating && filteredPosts.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">No blog posts found matching your criteria.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BlogManagement;