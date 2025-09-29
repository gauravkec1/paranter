-- Create additional enum types that don't exist
CREATE TYPE notification_type AS ENUM ('attendance', 'academic', 'transport', 'fee', 'event', 'general');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day');
CREATE TYPE fee_status AS ENUM ('paid', 'pending', 'overdue', 'partial');

-- Create schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update attendance table with proper enum
ALTER TABLE public.attendance 
DROP COLUMN IF EXISTS status,
ADD COLUMN status attendance_status NOT NULL DEFAULT 'present';

-- Create fees table for financial management
CREATE TABLE public.fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  fee_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status fee_status NOT NULL DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transport routes table
CREATE TABLE public.transport_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_name TEXT NOT NULL,
  driver_id UUID,
  vehicle_number TEXT,
  start_time TIME,
  end_time TIME,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transport tracking table
CREATE TABLE public.transport_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL,
  student_id UUID NOT NULL,
  pickup_point TEXT,
  drop_point TEXT,
  boarding_time TIMESTAMP WITH TIME ZONE,
  drop_time TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for fees
CREATE POLICY "Parents can view their children's fees" ON public.fees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = fees.student_id 
      AND students.parent_id = auth.uid()
    )
  );

CREATE POLICY "Admins and staff can manage all fees" ON public.fees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Create RLS policies for transport
CREATE POLICY "Drivers can view their routes" ON public.transport_routes
  FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "Admins can manage all routes" ON public.transport_routes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Parents can view their children's transport" ON public.transport_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = transport_tracking.student_id 
      AND students.parent_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can manage their route tracking" ON public.transport_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM transport_routes tr
      WHERE tr.id = transport_tracking.route_id 
      AND tr.driver_id = auth.uid()
    )
  );

-- Create triggers for updated_at on new tables
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fees_updated_at
  BEFORE UPDATE ON public.fees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_routes_updated_at
  BEFORE UPDATE ON public.transport_routes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_tracking_updated_at
  BEFORE UPDATE ON public.transport_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();