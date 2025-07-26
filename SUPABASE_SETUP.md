# Supabase Setup Guide for Citalf

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key

## 2. Set up Database Tables

Run these SQL commands in the Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'portfolio_manager', 'trader', 'viewer')),
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, permissions)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    COALESCE(new.raw_user_meta_data->>'role', 'trader'),
    CASE
      WHEN new.raw_user_meta_data->>'role' = 'admin' THEN
        ARRAY['view_dashboard', 'manage_strategies', 'run_backtest', 'view_analytics', 'execute_trades', 'view_reports', 'manage_users']
      WHEN new.raw_user_meta_data->>'role' = 'portfolio_manager' THEN
        ARRAY['view_dashboard', 'manage_strategies', 'run_backtest', 'view_analytics', 'execute_trades', 'view_reports']
      WHEN new.raw_user_meta_data->>'role' = 'trader' THEN
        ARRAY['view_dashboard', 'execute_trades', 'view_reports']
      ELSE
        ARRAY['view_dashboard']
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 3. Configure Environment Variables

1. Copy `.env.local` to `.env`:

   ```bash
   cp .env.local .env
   ```

2. Update the values in `.env`:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Test the Setup

1. Start the development server:

   ```bash
   npm start
   ```

2. Go to http://localhost:3000/signup
3. Create a new account
4. Check your email for verification link (if email verification is enabled)
5. Sign in with your new account

## 5. Optional: Configure Email Templates

In Supabase dashboard:

1. Go to Authentication > Email Templates
2. Customize the verification and password reset emails
3. Add your company branding

## 6. Security Best Practices

1. Enable email verification in Supabase Auth settings
2. Set up proper RLS policies for all tables
3. Use environment variables for sensitive data
4. Never commit `.env` file to git
5. Use different Supabase projects for development and production

## Troubleshooting

### "Supabase credentials not found"

- Make sure you've created `.env` file with correct values
- Restart the development server after changing environment variables

### "User profile not created"

- Check if the trigger function is properly set up
- Verify RLS policies are correct

### "Authentication failed"

- Verify your Supabase URL and anon key are correct
- Check if the user exists in Supabase Auth
- Ensure the profiles table has the user record
