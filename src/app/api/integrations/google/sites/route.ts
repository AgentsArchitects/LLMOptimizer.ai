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
      return NextResponse.json({ sites: [], connected: false }); // User hasn't connected Google yet
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expiry_date: tokenData.expiry_date
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
    const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });

    let siteUrls: string[] = [];
    let ga4Properties: any[] = [];

    const [gscResult, ga4Result] = await Promise.allSettled([
      searchconsole.sites.list(),
      analyticsadmin.accountSummaries.list()
    ]);

    if (gscResult.status === 'fulfilled') {
      siteUrls = (gscResult.value.data.siteEntry?.map(entry => entry.siteUrl).filter(Boolean) as string[]) || [];
    } else {
      console.warn("GSC fetch failed:", gscResult.reason);
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
      console.warn("GA4 fetch failed:", ga4Result.reason);
    }

    return NextResponse.json({ 
      sites: siteUrls, 
      ga4Properties,
      connected: true 
    });
  } catch (error: any) {
    console.error("Error fetching sites & properties:", error.message);
    return NextResponse.json({ error: error.message, sites: [], ga4Properties: [], connected: false }, { status: 500 });
  }
}



