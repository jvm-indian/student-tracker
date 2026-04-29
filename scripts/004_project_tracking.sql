-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending_guide', -- pending_guide, active
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, student_id)
);

-- Create project submissions table
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  report_url TEXT,
  certificate_url TEXT,
  marks INTEGER DEFAULT 0,
  coordinator_approval BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'submitted', -- submitted, graded, approved
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Teams policies
DROP POLICY IF EXISTS "teams_select" ON public.teams;
CREATE POLICY "teams_select" ON public.teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "teams_insert" ON public.teams;
CREATE POLICY "teams_insert" ON public.teams FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "teams_update" ON public.teams;
CREATE POLICY "teams_update" ON public.teams FOR UPDATE USING (
  auth.uid() = created_by OR 
  auth.uid() = guide_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Team members policies
DROP POLICY IF EXISTS "team_members_select" ON public.team_members;
CREATE POLICY "team_members_select" ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "team_members_insert" ON public.team_members;
CREATE POLICY "team_members_insert" ON public.team_members FOR INSERT WITH CHECK (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM teams WHERE id = team_id AND created_by = auth.uid())
);

DROP POLICY IF EXISTS "team_members_update" ON public.team_members;
CREATE POLICY "team_members_update" ON public.team_members FOR UPDATE USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM teams WHERE id = team_id AND created_by = auth.uid())
);

DROP POLICY IF EXISTS "team_members_delete" ON public.team_members;
CREATE POLICY "team_members_delete" ON public.team_members FOR DELETE USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM teams WHERE id = team_id AND created_by = auth.uid())
);

-- Project submissions policies
DROP POLICY IF EXISTS "submissions_select" ON public.project_submissions;
CREATE POLICY "submissions_select" ON public.project_submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "submissions_insert" ON public.project_submissions;
CREATE POLICY "submissions_insert" ON public.project_submissions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM team_members WHERE team_id = project_submissions.team_id AND student_id = auth.uid())
);

DROP POLICY IF EXISTS "submissions_update" ON public.project_submissions;
CREATE POLICY "submissions_update" ON public.project_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM team_members WHERE team_id = project_submissions.team_id AND student_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM teams WHERE id = project_submissions.team_id AND guide_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create Storage bucket for project files if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
