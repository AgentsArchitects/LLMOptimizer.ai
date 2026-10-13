-- Phase 1 Migration: Workspaces and Projects
-- Run this in your Supabase SQL Editor

-- 1. Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stripe_customer_id TEXT
);

-- 2. Workspace Members (Users belonging to a workspace)
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'owner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- 3. Projects (Brands/Clients within a Workspace)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT,
    target_keywords TEXT[],
    gsc_property TEXT,
    ga4_property_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Workspaces: Users can select workspaces they are members of
CREATE POLICY "Users can view their workspaces" 
ON public.workspaces FOR SELECT 
USING (id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Workspaces: Users can insert if they are authenticated (they create a workspace during onboarding)
CREATE POLICY "Users can create workspaces" 
ON public.workspaces FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Workspaces: Only owners can update
CREATE POLICY "Owners can update workspaces" 
ON public.workspaces FOR UPDATE 
USING (id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'owner'));

-- Workspace Members: Users can view members of their workspaces
CREATE POLICY "Users can view members of their workspaces" 
ON public.workspace_members FOR SELECT 
USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Workspace Members: Users can insert their own membership (initial creation) or owners can insert
CREATE POLICY "Users can add members" 
ON public.workspace_members FOR INSERT 
WITH CHECK (auth.uid() = user_id OR workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'owner'));

-- Projects: Users can view projects in their workspaces
CREATE POLICY "Users can view workspace projects" 
ON public.projects FOR SELECT 
USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Projects: Members can insert projects into their workspaces
CREATE POLICY "Members can create projects" 
ON public.projects FOR INSERT 
WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Projects: Members can update projects in their workspaces
CREATE POLICY "Members can update projects" 
ON public.projects FOR UPDATE 
USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));
