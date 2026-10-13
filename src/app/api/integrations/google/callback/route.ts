import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const userId = searchParams.get('state'); // Retrieve user ID we passed in step 1

  if (!code || !userId) {
    return NextResponse.redirect(new URL('/app/integrations?error=no_code_or_state', request.url));
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/google/callback'
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Use the Service Role Key to bypass RLS securely on the server backend
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Save or update the tokens in Supabase for this specific user
    const { error } = await supabaseAdmin
      .from('user_google_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.redirect(new URL('/app/integrations?success=google_connected', request.url));
    
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.redirect(new URL('/app/integrations?error=oauth_failed', request.url));
  }
}
