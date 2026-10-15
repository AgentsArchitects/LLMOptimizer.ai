import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', connected: false }, { status: 401 });
    }

    // Fetch the specific user's Google token from Supabase
    const { data: tokenData, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !tokenData) {
      return NextResponse.json({ sites: [], ga4Properties: [], connected: false, message: 'No Google account connected' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/google/callback'
    );
    
    oauth2Client.setCredentials({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expiry_date: tokenData.expiry_date
    });

    // Auto-save refreshed tokens if emitted
    oauth2Client.on('tokens', async (tokens) => {
      try {
        const updatePayload: any = { updated_at: new Date().toISOString() };
        if (tokens.access_token) updatePayload.access_token = tokens.access_token;
        if (tokens.refresh_token) updatePayload.refresh_token = tokens.refresh_token;
        if (tokens.expiry_date) updatePayload.expiry_date = tokens.expiry_date;
        await supabase
          .from('user_google_tokens')
          .update(updatePayload)
          .eq('user_id', user.id);
      } catch (e) {
        console.error("Error auto-updating refreshed tokens:", e);
      }
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
    const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });

    let siteDetails: any[] = [];
    let siteUrls: string[] = [];
    let ga4Properties: any[] = [];
    let tokenExpired = false;

    const [gscResult, ga4Result] = await Promise.allSettled([
      searchconsole.sites.list(),
      analyticsadmin.accountSummaries.list()
    ]);

    if (gscResult.status === 'fulfilled') {
      const entries = gscResult.value.data.siteEntry || [];
      siteDetails = entries.map(entry => ({
        siteUrl: entry.siteUrl,
        permissionLevel: entry.permissionLevel,
        isVerified: entry.permissionLevel !== 'siteUnverifiedUser'
      }));
      siteUrls = entries.map(entry => entry.siteUrl).filter(Boolean) as string[];
    } else {
      const reasonMsg = (gscResult.reason?.message || '').toLowerCase();
      console.warn("GSC fetch failed:", gscResult.reason);
      if (reasonMsg.includes('invalid_grant') || reasonMsg.includes('expired') || reasonMsg.includes('revoked')) {
        tokenExpired = true;
      }
    }

    if (ga4Result.status === 'fulfilled') {
      const ga4Response = ga4Result.value;
      if (ga4Response.data.accountSummaries) {
        ga4Response.data.accountSummaries.forEach((account: any) => {
          if (account.propertySummaries) {
            account.propertySummaries.forEach((prop: any) => {
              ga4Properties.push({
                accountId: account.account,
                accountName: account.displayName,
                propertyId: prop.property,
                propertyName: prop.displayName
              });
            });
          }
        });
      }
    } else {
      const reasonMsg = (ga4Result.reason?.message || '').toLowerCase();
      console.warn("GA4 fetch failed:", ga4Result.reason);
      if (reasonMsg.includes('invalid_grant') || reasonMsg.includes('expired') || reasonMsg.includes('revoked')) {
        tokenExpired = true;
      }
    }

    if (tokenExpired) {
      return NextResponse.json({ 
        sites: [], 
        siteDetails: [],
        ga4Properties: [],
        connected: false,
        tokenExpired: true,
        message: 'Google authorization expired or was revoked. Please reconnect your Google account.'
      });
    }

    return NextResponse.json({ 
      sites: siteUrls, 
      siteDetails,
      ga4Properties,
      connected: true,
      tokenExpired: false
    });
  } catch (error: any) {
    console.error("Error fetching sites & properties:", error.message);
    const msg = (error.message || '').toLowerCase();
    const isExpired = msg.includes('invalid_grant') || msg.includes('expired') || msg.includes('revoked');
    return NextResponse.json({ 
      error: error.message, 
      sites: [], 
      siteDetails: [],
      ga4Properties: [], 
      connected: !isExpired,
      tokenExpired: isExpired 
    }, { status: isExpired ? 200 : 500 });
  }
}
