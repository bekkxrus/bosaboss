import { supabase } from '../lib/supabase';

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

const demoUsers: DemoUser[] = [
  {
    email: 'admin@bosaboss.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'demo@bosaboss.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
  },
];

export const seedDemoUsers = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🌱 Starting demo user seeding...');
    
    for (const user of demoUsers) {
      console.log(`Checking if user ${user.email} exists...`);
      
      // Check if user already exists - use limit(1) instead of single()
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', user.email)
        .limit(1);

      if (checkError) {
        console.error(`Error checking user ${user.email}:`, checkError);
        continue;
      }

      // Check if user exists using array length instead of single result
      if (existingUsers && existingUsers.length > 0) {
        console.log(`✅ User ${user.email} already exists, skipping...`);
        continue;
      }

      console.log(`Creating user ${user.email}...`);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role,
          },
        },
      });

      if (authError) {
        console.error(`Auth error for ${user.email}:`, authError);
        continue;
      }

      if (!authData.user) {
        console.error(`No user data returned for ${user.email}`);
        continue;
      }

      console.log(`✅ Auth user created for ${user.email}`);

      // Create user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        });

      if (profileError) {
        console.error(`Profile error for ${user.email}:`, profileError);
        continue;
      }

      console.log(`✅ Profile created for ${user.email}`);

      // For admin users, also update the auth metadata
      if (user.role === 'admin') {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { role: 'admin' }
        });

        if (metadataError) {
          console.warn(`Could not update metadata for ${user.email}:`, metadataError);
        } else {
          console.log(`✅ Admin metadata set for ${user.email}`);
        }
      }
    }

    return {
      success: true,
      message: 'Demo users created successfully! You can now log in with the provided credentials.',
    };

  } catch (error: any) {
    console.error('Error seeding demo users:', error);
    return {
      success: false,
      message: `Failed to create demo users: ${error.message}`,
    };
  }
};

export const checkDemoUsersExist = async (): Promise<boolean> => {
  try {
    // Check if any of the demo users exist - use limit instead of single
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .in('email', demoUsers.map(u => u.email))
      .limit(demoUsers.length);

    if (error) {
      console.error('Error checking demo users:', error);
      return false;
    }

    // Return true if we found any demo users
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking demo users:', error);
    return false;
  }
};