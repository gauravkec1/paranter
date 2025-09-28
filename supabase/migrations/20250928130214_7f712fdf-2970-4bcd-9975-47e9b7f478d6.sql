-- Fix infinite recursion in students table RLS policies
-- Drop the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Teachers can view their class students" ON public.students;

-- Create a simpler, non-recursive policy for teachers
CREATE POLICY "Teachers can view students in their classes" 
ON public.students 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.classes 
    WHERE classes.teacher_id = auth.uid() 
    AND classes.grade_level = students.grade_level 
    AND classes.section = students.class_section
  )
);

-- Also ensure parents policy is simple and clear
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;

CREATE POLICY "Parents can view their children" 
ON public.students 
FOR SELECT 
USING (parent_id = auth.uid());