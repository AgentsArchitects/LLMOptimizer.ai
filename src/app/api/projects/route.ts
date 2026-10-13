import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workspaces user is part of
    const { data: memberData } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id);
      
    if (!memberData || memberData.length === 0) {
      return NextResponse.json({ projects: [] });
    }
    
    const workspaceIds = memberData.map(m => m.workspace_id);

    // Get projects in those workspaces
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .in('workspace_id', workspaceIds)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects: projects || [] });
  } catch (error: any) {
    console.error("Error fetching projects:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
