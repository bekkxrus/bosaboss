/*
  # Trucking Company Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (enum: admin, driver, client)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `quote_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `pickup_location` (text)
      - `delivery_location` (text)
      - `cargo_type` (text)
      - `weight` (text)
      - `dimensions` (text)
      - `pickup_date` (date)
      - `delivery_date` (date)
      - `service_type` (text)
      - `special_requirements` (text)
      - `company_name` (text)
      - `contact_name` (text)
      - `email` (text)
      - `phone` (text)
      - `status` (enum: pending, approved, rejected)
      - `amount` (decimal)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `driver_applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users, nullable)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `cdl_number` (text)
      - `cdl_class` (text)
      - `cdl_expiration` (date)
      - `experience_years` (text)
      - `truck_type` (text)
      - `trailer_type` (text)
      - `insurance_carrier` (text)
      - `policy_number` (text)
      - `mc_number` (text)
      - `dot_number` (text)
      - `preferred_lanes` (text)
      - `home_base` (text)
      - `available_date` (date)
      - `cdl_document_url` (text)
      - `insurance_document_url` (text)
      - `mc_authority_url` (text)
      - `w9_document_url` (text)
      - `status` (enum: pending, under_review, approved, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (enum: trucking, dispatching)
      - `description` (text)
      - `features` (jsonb)
      - `price` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `author` (text)
      - `category` (text)
      - `status` (enum: draft, published)
      - `publish_date` (date)
      - `read_time` (text)
      - `featured_image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `subject` (text)
      - `message` (text)
      - `inquiry_type` (text)
      - `status` (enum: new, read, responded)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Public access for quote requests and contact messages
    - Admin access for all management functions
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'driver', 'client');
CREATE TYPE quote_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE driver_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE service_category AS ENUM ('trucking', 'dispatching');
CREATE TYPE post_status AS ENUM ('draft', 'published');
CREATE TYPE message_status AS ENUM ('new', 'read', 'responded');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'client',
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  pickup_location text NOT NULL,
  delivery_location text NOT NULL,
  cargo_type text NOT NULL,
  weight text,
  dimensions text,
  pickup_date date,
  delivery_date date,
  service_type text DEFAULT 'ftl',
  special_requirements text,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status quote_status DEFAULT 'pending',
  amount decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Driver applications table
CREATE TABLE IF NOT EXISTS driver_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  cdl_number text NOT NULL,
  cdl_class text NOT NULL,
  cdl_expiration date NOT NULL,
  experience_years text NOT NULL,
  truck_type text NOT NULL,
  trailer_type text NOT NULL,
  insurance_carrier text NOT NULL,
  policy_number text NOT NULL,
  mc_number text,
  dot_number text,
  preferred_lanes text,
  home_base text NOT NULL,
  available_date date NOT NULL,
  cdl_document_url text,
  insurance_document_url text,
  mc_authority_url text,
  w9_document_url text,
  status driver_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category service_category NOT NULL,
  description text NOT NULL,
  features jsonb DEFAULT '[]',
  price text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  status post_status DEFAULT 'draft',
  publish_date date DEFAULT CURRENT_DATE,
  read_time text,
  featured_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  inquiry_type text DEFAULT 'general',
  status message_status DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_applications_updated_at BEFORE UPDATE ON driver_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Quote requests policies
CREATE POLICY "Anyone can create quote requests" ON quote_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own quote requests" ON quote_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all quote requests" ON quote_requests
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update quote requests" ON quote_requests
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Driver applications policies
CREATE POLICY "Anyone can create driver applications" ON driver_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own driver applications" ON driver_applications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all driver applications" ON driver_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update driver applications" ON driver_applications
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services policies
CREATE POLICY "Anyone can read active services" ON services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage all services" ON services
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Blog posts policies
CREATE POLICY "Anyone can read published blog posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can manage all blog posts" ON blog_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all contact messages" ON contact_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO services (name, category, description, features, price, is_active) VALUES
  (
    'Full Truckload (FTL)',
    'trucking',
    'Dedicated trucks for your exclusive cargo with priority scheduling and faster transit times.',
    '["Direct delivery", "Reduced handling", "Faster transit", "Priority scheduling"]',
    'Custom Quote',
    true
  ),
  (
    'Less Than Truckload (LTL)',
    'trucking',
    'Cost-effective shipping for smaller loads with consolidated transportation.',
    '["Cost-effective", "Flexible scheduling", "Terminal services", "Shared transport"]',
    'Starting at $0.85/mile',
    true
  ),
  (
    'Refrigerated Transport',
    'trucking',
    'Temperature-controlled shipping for perishable goods and sensitive cargo.',
    '["Temperature control", "Monitoring systems", "Specialized equipment", "Food-grade certification"]',
    'Custom Quote',
    true
  ),
  (
    '24/7 Dispatch Support',
    'dispatching',
    'Round-the-clock assistance for drivers with experienced dispatch professionals.',
    '["24/7 availability", "Emergency support", "Route planning", "Problem resolution"]',
    '$500/month',
    true
  ),
  (
    'Load Board Management',
    'dispatching',
    'Access to premium load boards with high-paying freight opportunities.',
    '["Multiple load boards", "Real-time updates", "Rate optimization", "Credit checks"]',
    '$300/month',
    true
  ),
  (
    'Paperwork Management',
    'dispatching',
    'Complete handling of all shipping documentation and compliance requirements.',
    '["BOL processing", "Invoice management", "Compliance tracking", "Digital records"]',
    '$200/month',
    true
  );

INSERT INTO blog_posts (title, excerpt, content, author, category, status, publish_date, read_time, featured_image_url) VALUES
  (
    'The Future of Trucking: Technology Trends Shaping 2024',
    'Explore how autonomous vehicles, IoT tracking, and AI-powered dispatching are revolutionizing the trucking industry.',
    '# The Future of Trucking: Technology Trends Shaping 2024

The trucking industry is experiencing a technological revolution that''s transforming how goods move across the country. From autonomous vehicles to AI-powered dispatching, these innovations are reshaping the landscape of logistics.

## Autonomous Vehicles

Self-driving trucks are no longer science fiction. Companies like Waymo and Tesla are making significant strides in autonomous trucking technology.

## IoT and Real-Time Tracking

Internet of Things (IoT) devices are providing unprecedented visibility into fleet operations, cargo conditions, and driver behavior.

## AI-Powered Dispatching

Artificial intelligence is optimizing route planning, load matching, and fuel efficiency like never before.',
    'Sarah Johnson',
    'Technology',
    'published',
    '2024-01-15',
    '8 min read',
    'https://images.pexels.com/photos/1430818/pexels-photo-1430818.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  ),
  (
    'Top 10 Safety Tips for Long-Haul Drivers',
    'Essential safety practices every professional driver should follow to ensure safe and successful trips.',
    '# Top 10 Safety Tips for Long-Haul Drivers

Safety should always be the top priority for professional drivers. Here are essential tips to keep you safe on the road.

## 1. Pre-Trip Inspections

Always conduct thorough pre-trip inspections to identify potential issues before they become problems.

## 2. Manage Your Hours

Follow HOS regulations and get adequate rest to prevent fatigue-related accidents.',
    'Mike Rodriguez',
    'Safety',
    'published',
    '2024-01-12',
    '5 min read',
    'https://images.pexels.com/photos/1430825/pexels-photo-1430825.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  );