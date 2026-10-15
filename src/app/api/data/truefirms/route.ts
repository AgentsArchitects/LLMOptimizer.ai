import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const range = searchParams.get('range') || '28d';
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required. Please select a project from the sidebar.'     }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lookup project to get mapped properties
    const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const requestedSite = project.gsc_property;
    const ga4PropertyId = project.ga4_property_id;

    if (!requestedSite) {
      return NextResponse.json({ error: 'No GSC property mapped. Please map it in Integrations.' }, { status: 400 });
    }

    const { data: tokenData, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !tokenData) {
      return NextResponse.json({ error: 'Please connect Google account first' }, { status: 401 });
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
    
    // Calculate dates based on range or custom dates
    let startStr = '';
    let endStr = '';

    if (customStart && customEnd) {
      startStr = customStart;
      endStr = customEnd;
    } else {
      let endDate = new Date();
      let startDate = new Date();
      
      let days = 28; // Default to GSC 28 days
      if (range === '24h') days = 1;
      if (range === '7d') days = 7;
      if (range === '28d') days = 28;
      if (range === '3m') days = 90;
      if (range === '6m') days = 180;
      if (range === '12m') days = 365;
      if (range === '16m') days = 480;
      
      if (range === '24h') {
        startDate.setDate(startDate.getDate() - 1);
      } else {
        // GSC typically has a 3-day data processing lag for default views.
        // E.g. if today is Oct 6, GSC '7 days' is Sept 27 to Oct 3.
        endDate.setDate(endDate.getDate() - 3);
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - (days - 1));
      }
      
      startStr = startDate.toISOString().split('T')[0];
      endStr = endDate.toISOString().split('T')[0];
    }

    // Compare Logic
    const compare = searchParams.get('compare') === 'true';
    const compareRange = searchParams.get('compareRange') || 'prev';
    const compareStartDate = searchParams.get('compareStartDate');
    const compareEndDate = searchParams.get('compareEndDate');
    
    let compStartStr = '';
    let compEndStr = '';

    if (compare) {
       if (compareRange === 'custom' && compareStartDate && compareEndDate) {
           compStartStr = compareStartDate;
           compEndStr = compareEndDate;
       } else if (compareRange.includes('yoy')) {
           const sDate = new Date(startStr);
           sDate.setFullYear(sDate.getFullYear() - 1);
           compStartStr = sDate.toISOString().split('T')[0];
           
           const eDate = new Date(endStr);
           eDate.setFullYear(eDate.getFullYear() - 1);
           compEndStr = eDate.toISOString().split('T')[0];
       } else {
           const start = new Date(startStr);
           const end = new Date(endStr);
           const diffTime = Math.abs(end.getTime() - start.getTime());
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
           
           const compEnd = new Date(start);
           compEnd.setDate(compEnd.getDate() - 1);
           
           const compStart = new Date(compEnd);
           compStart.setDate(compStart.getDate() - (diffDays - 1));
           
           compStartStr = compStart.toISOString().split('T')[0];
           compEndStr = compEnd.toISOString().split('T')[0];
       }
    }

    const countryNames: Record<string, string> = {
      ind: 'India',
      usa: 'United States',
      pak: 'Pakistan',
      gbr: 'United Kingdom',
      nld: 'Netherlands',
      can: 'Canada',
      aus: 'Australia',
      deu: 'Germany',
      fra: 'France',
      sgp: 'Singapore',
      are: 'United Arab Emirates',
      bgd: 'Bangladesh',
      mys: 'Malaysia',
      phl: 'Philippines',
      vnm: 'Vietnam',
      idn: 'Indonesia',
      bra: 'Brazil',
      zaf: 'South Africa',
      sau: 'Saudi Arabia',
      nga: 'Nigeria'
    };

    const gscQueries = [
      searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: startStr, endDate: endStr, dimensions: ['date'], dataState: 'all' }
      }),
      searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: startStr, endDate: endStr, dimensions: ['query'], rowLimit: 50, dataState: 'all' }
      }),
      searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: startStr, endDate: endStr, dimensions: ['page'], rowLimit: 50, dataState: 'all' }
      }),
      searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: startStr, endDate: endStr, dimensions: ['device'], dataState: 'all' }
      }),
      searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: startStr, endDate: endStr, dimensions: ['country'], rowLimit: 10, dataState: 'all' }
      })
    ];

    if (compare) {
      gscQueries.push(searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: compStartStr, endDate: compEndStr, dimensions: ['date'], dataState: 'all' }
      }));
      gscQueries.push(searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: compStartStr, endDate: compEndStr, dimensions: ['query'], rowLimit: 50, dataState: 'all' }
      }));
      gscQueries.push(searchconsole.searchanalytics.query({
        siteUrl: requestedSite,
        requestBody: { startDate: compStartStr, endDate: compEndStr, dimensions: ['page'], rowLimit: 50, dataState: 'all' }
      }));
    }
    
    // GA4 Queries
    let ga4Data = { activeUsers: 0, eventCount: 0, keyEvents: 0, conversions: 0, views: 0, sessions: 0 };
    let compGa4Data = { activeUsers: 0, eventCount: 0, keyEvents: 0, conversions: 0, views: 0, sessions: 0 };
    let ga4PagesRows: any[] = [];
    
    // Determine GA4 specific dates to align with GA4 UI (which typically ends "Yesterday" rather than GSC's -3 days)
    let ga4StartStr = startStr;
    let ga4EndStr = endStr;
    let ga4CompStartStr = compStartStr;
    let ga4CompEndStr = compEndStr;

    if (!customStart && !customEnd && range !== '24h') {
        const ga4End = new Date();
        ga4End.setDate(ga4End.getDate() - 1); // Yesterday
        const ga4Start = new Date(ga4End);
        
        let days = 28;
        if (range === '7d') days = 7;
        if (range === '28d') days = 28;
        if (range === '3m') days = 90;
        if (range === '6m') days = 180;
        if (range === '12m') days = 365;
        if (range === '16m') days = 480;
        
        ga4Start.setDate(ga4Start.getDate() - (days - 1));
        ga4StartStr = ga4Start.toISOString().split('T')[0];
        ga4EndStr = ga4End.toISOString().split('T')[0];

        // Recalculate comparison dates for GA4
        if (compare) {
            if (compareRange === 'custom' && compareStartDate && compareEndDate) {
                ga4CompStartStr = compareStartDate;
                ga4CompEndStr = compareEndDate;
            } else if (compareRange.includes('yoy')) {
                const sDate = new Date(ga4StartStr);
                sDate.setFullYear(sDate.getFullYear() - 1);
                ga4CompStartStr = sDate.toISOString().split('T')[0];
                const eDate = new Date(ga4EndStr);
                eDate.setFullYear(eDate.getFullYear() - 1);
                ga4CompEndStr = eDate.toISOString().split('T')[0];
            } else {
                // prev period
                const diffDays = Math.ceil((new Date(ga4EndStr).getTime() - new Date(ga4StartStr).getTime()) / (1000 * 3600 * 24)) + 1;
                const cEnd = new Date(ga4StartStr);
                cEnd.setDate(cEnd.getDate() - 1);
                const cStart = new Date(cEnd);
                cStart.setDate(cStart.getDate() - (diffDays - 1));
                ga4CompStartStr = cStart.toISOString().split('T')[0];
                ga4CompEndStr = cEnd.toISOString().split('T')[0];
            }
        }
    }

    if (ga4PropertyId) {
      const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: oauth2Client });
      const propertyStr = ga4PropertyId.startsWith('properties/') ? ga4PropertyId : 'properties/' + ga4PropertyId;
      
      const gaMetrics = [
        { name: 'activeUsers' },
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'screenPageViews' },
        { name: 'sessions' }
      ];

      try {
        const [overallRes, pagesReportRes] = await Promise.all([
          analyticsdata.properties.runReport({
            property: propertyStr,
            requestBody: {
              dateRanges: [{ startDate: ga4StartStr, endDate: ga4EndStr }],
              metrics: gaMetrics
            }
          }),
          analyticsdata.properties.runReport({
            property: propertyStr,
            requestBody: {
              dateRanges: [{ startDate: ga4StartStr, endDate: ga4EndStr }],
              dimensions: [{ name: 'pagePath' }],
              metrics: [{ name: 'sessions' }, { name: 'conversions' }],
              limit: '50'
            }
          })
        ]);

        if (overallRes.data.rows && overallRes.data.rows.length > 0) {
          const metrics = overallRes.data.rows[0].metricValues;
          ga4Data = {
            activeUsers: parseInt(metrics?.[0]?.value || '0'),
            eventCount: parseInt(metrics?.[1]?.value || '0'),
            keyEvents: parseInt(metrics?.[2]?.value || '0'),
            conversions: parseInt(metrics?.[2]?.value || '0'),
            views: parseInt(metrics?.[3]?.value || '0'),
            sessions: parseInt(metrics?.[4]?.value || '0')
          };
        }

        ga4PagesRows = pagesReportRes.data.rows || [];
      } catch (gaError) {
        console.error("GA4 Fetch Error:", gaError);
      }
      
      if (compare) {
        try {
          const compResponse = await analyticsdata.properties.runReport({
            property: propertyStr,
            requestBody: {
              dateRanges: [{ startDate: ga4CompStartStr, endDate: ga4CompEndStr }],
              metrics: gaMetrics
            }
          });
          if (compResponse.data.rows && compResponse.data.rows.length > 0) {
            const metrics = compResponse.data.rows[0].metricValues;
            compGa4Data = {
              activeUsers: parseInt(metrics?.[0]?.value || '0'),
              eventCount: parseInt(metrics?.[1]?.value || '0'),
              keyEvents: parseInt(metrics?.[2]?.value || '0'),
              conversions: parseInt(metrics?.[2]?.value || '0'),
              views: parseInt(metrics?.[3]?.value || '0'),
              sessions: parseInt(metrics?.[4]?.value || '0')
            };
          }
        } catch (compGaError) {
          console.error("GA4 Compare Fetch Error:", compGaError);
        }
      }
    }

    let results: any[] = [];
    let gscError: string | null = null;
    try {
      results = await Promise.all(gscQueries);
    } catch (gscErr: any) {
      console.warn("GSC query failed:", gscErr.message);
      gscError = gscErr.message || 'Failed to query Google Search Console';
    }

    const timelineRes = results[0] || { data: { rows: [] } };
    const queriesRes = results[1] || { data: { rows: [] } };
    const pagesRes = results[2] || { data: { rows: [] } };
    const devicesRes = results[3] || { data: { rows: [] } };
    const countriesRes = results[4] || { data: { rows: [] } };
    let compTimelineRes = null, compQueriesRes = null, compPagesRes = null;
    if (compare) {
      compTimelineRes = results[5] || null;
      compQueriesRes = results[6] || null;
      compPagesRes = results[7] || null;
    }

    // Process Devices
    const devices = (devicesRes?.data?.rows || []).map((row: any) => ({
      device: row.keys[0].charAt(0).toUpperCase() + row.keys[0].slice(1).toLowerCase(),
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: ((row.ctr || 0) * 100).toFixed(2),
      position: (row.position || 0).toFixed(1)
    }));

    // Process Countries
    const countries = (countriesRes?.data?.rows || []).map((row: any) => {
      const code = (row.keys[0] || '').toLowerCase();
      return {
        country: countryNames[code] || row.keys[0].toUpperCase(),
        code: code,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: ((row.ctr || 0) * 100).toFixed(2),
        position: (row.position || 0).toFixed(1)
      };
    });

    // Blend GSC Pages + GA4 Pages
    const ga4PageMap = new Map();
    ga4PagesRows.forEach((r: any) => {
      const path = (r.dimensionValues?.[0]?.value || '').replace(/\/$/, '') || '/';
      ga4PageMap.set(path, {
        sessions: parseInt(r.metricValues?.[0]?.value || '0'),
        conversions: parseInt(r.metricValues?.[1]?.value || '0')
      });
    });

    const gscPagesList = pagesRes?.data?.rows || [];
    const blendedPages = gscPagesList.map((r: any) => {
      const rawUrl = r.keys[0];
      let path = '/';
      try {
        path = new URL(rawUrl).pathname.replace(/\/$/, '') || '/';
      } catch (e) {
        path = rawUrl.replace(/\/$/, '') || '/';
      }
      const ga = ga4PageMap.get(path) || { sessions: 0, conversions: 0 };
      return {
        path,
        url: rawUrl,
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: r.ctr || 0,
        position: r.position || 0,
        sessions: ga.sessions,
        conversions: ga.conversions
      };
    });

    // Opportunity 1: High Traffic, Low Ranking
    const highTrafficLowRank = blendedPages
      .filter((p: any) => p.position > 10)
      .sort((a: any, b: any) => ((b.sessions * 2 + b.impressions) - (a.sessions * 2 + a.impressions)))
      .slice(0, 3);

    // Opportunity 2: High Impressions, Low CTR
    const highImprLowCtr = blendedPages
      .filter((p: any) => p.impressions >= 100 && p.ctr < 0.03)
      .sort((a: any, b: any) => b.impressions - a.impressions)
      .slice(0, 3);

    const opportunities = {
      highTrafficLowRank,
      highImprLowCtr
    };

    return NextResponse.json({
      timeline: timelineRes.data.rows || [],
      topQueries: queriesRes.data.rows || [],
      topPages: pagesRes.data.rows || [],
      compTimeline: compare && compTimelineRes ? compTimelineRes.data.rows || [] : [],
      compQueries: compare && compQueriesRes ? compQueriesRes.data.rows || [] : [],
      compPages: compare && compPagesRes ? compPagesRes.data.rows || [] : [],
      ga4: ga4Data,
      compGa4: compGa4Data,
      devices,
      countries,
      opportunities,
      gscError,
      requestedSite,
      ga4PropertyId
    });

  } catch (error: any) {
    console.error("Data Fetch Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}









