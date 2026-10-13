import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, gsc_property, ga4_property_id } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        gsc_property,
        ga4_property_id
      })
      .eq('id', projectId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, projectId });
  } catch (error: any) {
    console.error("Error updating project:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

