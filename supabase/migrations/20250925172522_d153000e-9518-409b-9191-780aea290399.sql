-- Enable RLS on assignment_submissions table
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Students can view their own submissions
CREATE POLICY "Students can view their own submissions" 
ON public.assignment_submissions 
FOR SELECT 
USING (student_id = auth.uid());

-- Students can insert their own submissions
CREATE POLICY "Students can insert their own submissions" 
ON public.assignment_submissions 
FOR INSERT 
WITH CHECK (student_id = auth.uid());

-- Students can update their own submissions (before grading)
CREATE POLICY "Students can update their own submissions" 
ON public.assignment_submissions 
FOR UPDATE 
USING (student_id = auth.uid() AND graded_at IS NULL);

-- Teachers can view submissions for their assignments
CREATE POLICY "Teachers can view submissions for their assignments" 
ON public.assignment_submissions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.assignments 
  WHERE assignments.id = assignment_submissions.assignment_id 
  AND assignments.teacher_id = auth.uid()
));

-- Teachers can update submissions for their assignments (grading)
CREATE POLICY "Teachers can update submissions for their assignments" 
ON public.assignment_submissions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.assignments 
  WHERE assignments.id = assignment_submissions.assignment_id 
  AND assignments.teacher_id = auth.uid()
));

-- Admins can manage all submissions
CREATE POLICY "Admins can manage all submissions" 
ON public.assignment_submissions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));