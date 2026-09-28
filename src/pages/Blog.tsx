import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const featuredPost = {
    title: 'The Future of Trucking: Technology Trends Shaping 2024',
    excerpt: 'Explore how autonomous vehicles, IoT tracking, and AI-powered dispatching are revolutionizing the trucking industry. Learn what these changes mean for drivers and fleet owners.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/1430818/pexels-photo-1430818.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    readTime: '8 min read',
  };

  const defaultPosts = [
    {
      title: 'Top 10 Safety Tips for Long-Haul Drivers',
      excerpt: 'Essential safety practices every professional driver should follow to ensure safe and successful trips across the country.',
      author: 'Mike Rodriguez',
      date: '2024-01-12',
      category: 'Safety',
      image: 'https://images.pexels.com/photos/1430825/pexels-photo-1430825.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      readTime: '5 min read',
    },
    {
      title: 'Understanding Freight Rates: A Driver\'s Guide',
      excerpt: 'Navigate the complex world of freight pricing and learn how to negotiate better rates for your loads.',
      author: 'Lisa Chen',
      date: '2024-01-08',
      category: 'Business',
      image: 'https://images.pexels.com/photos/1430833/pexels-photo-1430833.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      readTime: '6 min read',
    },
    {
      title: 'Dispatch Best Practices for Fleet Managers',
      excerpt: 'Proven strategies for optimizing dispatch operations and improving driver satisfaction and retention.',
      author: 'David Kim',
      date: '2024-01-05',
      category: 'Dispatch',
      image: 'https://images.pexels.com/photos/1430841/pexels-photo-1430841.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      readTime: '7 min read',
    },
    {
      title: 'Maintaining Your Truck: Preventive Care Tips',
      excerpt: 'Keep your rig running smoothly with these essential maintenance tips that every owner-operator should know.',
      author: 'Robert Wilson',
      date: '2024-01-02',
      category: 'Maintenance',
      image: 'https://images.pexels.com/photos/1430849/pexels-photo-1430849.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      readTime: '4 min read',
    },
    {
      title: 'ELD Compliance: What Every Driver Needs to Know',
      excerpt: 'Stay compliant with electronic logging device regulations and avoid costly violations with this comprehensive guide.',
      author: 'Jennifer Martinez',
      date: '2023-12-28',
      category: 'Compliance',
      image: 'https://images.pexels.com/photos/1430857/pexels-photo-1430857.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      readTime: '6 min read',
    },
    {
      title: 'Building Strong Relationships with Shippers',
      excerpt: 'Learn how to develop lasting partnerships with shippers that lead to consistent, high-paying loads.',
      author: 'Tom Anderson',
      date: '2023-12-25',
      category: 'Business',
      image: 'https://images.pexels.com/photos/1430865/pexels-photo-1430865.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      readTime: '5 min read',
    },
  ];

  useEffect(() => {
    fetchBlogPosts();
    
    // Set up real-time subscription for blog posts
    const subscription = supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'blog_posts' 
      }, () => {
        fetchBlogPosts();
      })
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching blog posts:', fetchError);
        setError('Failed to load blog posts');
        setPosts(defaultPosts);
        return;
      }
      
      if (data && data.length > 0) {
        // Map database posts to component format
        const formattedPosts = data.map(post => ({
          title: post.title,
          excerpt: post.excerpt,
          author: post.author,
          date: new Date(post.publish_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          category: post.category,
          image: post.featured_image_url || `https://images.pexels.com/photos/1430833/pexels-photo-1430833.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop`,
          readTime: post.read_time || '5 min read',
        }));
        setPosts(formattedPosts);
      } else {
        // Fall back to default posts if no data
        setPosts(defaultPosts);
      }
    } catch (err) {
      console.error('Error in fetchBlogPosts:', err);
      setError('An unexpected error occurred');
      setPosts(defaultPosts);
    } finally {
      setLoading(false);
    }
  };
  const categories = [
    { name: 'All Posts', count: 24, icon: TrendingUp },
    { name: 'Safety', count: 8, icon: Shield },
    { name: 'Technology', count: 6, icon: Truck },
    { name: 'Business', count: 5, icon: TrendingUp },
    { name: 'Dispatch', count: 3, icon: User },
    { name: 'Compliance', count: 2, icon: Shield },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Technology: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Safety: 'bg-green-500/20 text-green-400 border-green-500/30',
      Business: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Dispatch: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Compliance: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fade-in">
            Trucking <span className="text-red-primary">Industry Blog</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Stay informed with the latest news, tips, and insights from the trucking and logistics industry. 
            Expert advice for drivers, fleet managers, and business owners.
          </p>
        </div>
      </section>

      <div className="bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              <Card className="mb-12 overflow-hidden group animate-fade-in" hover>
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="md:w-1/2 p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(featuredPost.category)}`}>
                        {featuredPost.category}
                      </span>
                      <span className="text-white/60 text-sm font-semibold">{featuredPost.readTime}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4 group-hover:text-red-primary transition-colors duration-300">{featuredPost.title}</h2>
                    <p className="text-white/70 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span className="font-semibold">{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="text-sm group">
                        Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Blog Posts Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-primary">{error}</p>
                  <Button onClick={fetchBlogPosts} className="mt-4">Retry</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post, index) => (
                    <Card key={index} hover className="group overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </span>
                          <span className="text-white/60 text-sm">{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">
                          {post.title}
                        </h3>
                        <p className="text-white/70 mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span className="font-semibold">{post.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-red-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="shadow-red-glow">
                  Load More Posts
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <Card className="animate-slide-up">
                <h3 className="text-lg font-black text-white mb-6">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-red-primary/10 transition-all duration-300 cursor-pointer group border border-transparent hover:border-red-primary/30"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-white/80 group-hover:text-white transition-colors duration-300 font-semibold">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-white/60 text-sm font-bold">{category.count}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Newsletter */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-black text-white mb-4">Stay Updated</h3>
                <p className="text-white/70 mb-6 text-sm leading-relaxed">
                  Subscribe to our newsletter for the latest trucking industry news and tips.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white placeholder-red-primary/50 focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                  />
                  <Button className="w-full shadow-red-glow">
                    Subscribe
                  </Button>
                </div>
              </Card>

              {/* Popular Posts */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-black text-white mb-6">Popular Posts</h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post, index) => (
                    <div key={index} className="group cursor-pointer p-3 rounded-lg hover:bg-red-primary/10 transition-all duration-300 border border-transparent hover:border-red-primary/30">
                      <h4 className="text-sm font-bold text-white/80 group-hover:text-red-primary transition-colors duration-300 mb-2 leading-relaxed">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-white/60">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;