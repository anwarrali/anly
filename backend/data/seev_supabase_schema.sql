-- ==========================================
-- SEEV DATABASE ARCHITECTURE (POSTGRESQL)
-- ==========================================

-- Enable modern PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- --------------------------------------------------------
-- 1. ENUM TYPES
-- --------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('client', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_category') THEN
        CREATE TYPE template_category AS ENUM (
            'business', 'portfolio', 'ecommerce', 'blog', 'landing', 
            'restaurant', 'real_estate', 'health', 'saas', 'other'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM (
            'pending', 'confirmed', 'in_progress', 'review', 'completed', 'cancelled'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM (
            'unpaid', 'paid', 'refunded', 'failed'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_type') THEN
        CREATE TYPE service_type AS ENUM (
            'free_template', 'basic_setup', 'standard_setup', 'premium_setup', 
            'custom_basic', 'custom_standard', 'custom_premium', 
            'template_purchase', 'template_modification', 'full_customization'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('card', 'visa', 'mastercard');
    END IF;
END $$;

-- --------------------------------------------------------
-- 2. PRICING PLANS (STATIC DATA)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    service_tier TEXT NOT NULL, -- 'customization', 'custom_build'
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    edit_limit INTEGER NOT NULL DEFAULT 0,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 3. PROFILES (Extends Supabase auth.users)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'client',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 4. TEMPLATES
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_ar TEXT DEFAULT '',
    image_url TEXT,
    download_url TEXT,
    template_file_url TEXT,
    category template_category NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10, 2),
    preview_images JSONB DEFAULT '[]', -- Array of strings
    demo_url TEXT,
    description TEXT NOT NULL,
    description_ar TEXT DEFAULT '',
    tags JSONB DEFAULT '[]', -- GIN indexed
    tech_stack JSONB DEFAULT '[]',
    features JSONB DEFAULT '[]',
    includes JSONB DEFAULT '[]',
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new_item BOOLEAN DEFAULT true,
    sales_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 5. ORDERS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    service_type service_type NOT NULL,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'unpaid',
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'usd',
    delivery_date TIMESTAMP WITH TIME ZONE,
    admin_note TEXT DEFAULT '',
    bop_session_id TEXT DEFAULT '',
    bop_receipt_id TEXT DEFAULT '',
    checkout_url TEXT DEFAULT '',
    edit_limit INTEGER DEFAULT 0,
    edit_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 6. CUSTOMIZATION REQUESTS (Project Details)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customization_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    business_name TEXT DEFAULT '',
    website_goal TEXT DEFAULT '',
    color_preference TEXT DEFAULT '',
    brand_assets JSONB DEFAULT '[]',
    additional_notes TEXT DEFAULT '',
    requirements TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    timeline TEXT DEFAULT '',
    budget_range TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 7. PAYMENTS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    transaction_id TEXT UNIQUE, -- Paymob / BOP Transaction ID
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed', 'refunded'
    payment_method payment_method,
    receipt_url TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 8. INDEXING & PERFORMANCE
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);

-- Full-text search for templates
CREATE INDEX IF NOT EXISTS idx_templates_search ON public.templates USING GIN (to_tsvector('english', title || ' ' || description));

-- --------------------------------------------------------
-- 9. TRIGGERS & RLS (Row Level Security)
-- --------------------------------------------------------

-- Update 'updated_at' function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Sync Profile on Sign-up Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'User'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Public Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Templates are viewable by everyone" ON public.templates FOR SELECT USING (true);
CREATE POLICY "Only admins can manage templates" ON public.templates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
