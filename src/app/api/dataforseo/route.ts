import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const LOGIN = process.env.DATAFORSEO_LOGIN || '';
const PASSWORD = process.env.DATAFORSEO_PASSWORD || '';
const AUTH_HEADER = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64');

const CACHE_DIR = path.join(process.cwd(), '.dataforseo_cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create cache dir:', e);
  }
}

function getCache(key: string, ttlMs = 24 * 60 * 60 * 1000) {
  try {
    const filename = path.join(CACHE_DIR, `${crypto.createHash('md5').update(key).digest('hex')}.json`);
    if (fs.existsSync(filename)) {
      const stat = fs.statSync(filename);
      if (Date.now() - stat.mtimeMs < ttlMs) {
        const content = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(content);
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return null;
}

function setCache(key: string, data: any) {
  try {
    const filename = path.join(CACHE_DIR, `${crypto.createHash('md5').update(key).digest('hex')}.json`);
    fs.writeFileSync(filename, JSON.stringify(data), 'utf-8');
  } catch (e) {
    console.warn('Cache write error:', e);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'keywords';
    const forceRefresh = searchParams.get('refresh') === 'true';

    // 1. Account Info & Balance
    if (action === 'account') {
      const cacheKey = 'account_balance';
      if (!forceRefresh) {
        const cached = getCache(cacheKey, 5 * 60 * 1000); // 5 min TTL
        if (cached) return NextResponse.json({ ...cached, cached: true });
      }

      const res = await fetch('https://api.dataforseo.com/v3/appendix/user_data', {
        headers: { Authorization: AUTH_HEADER, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      const result = data.tasks?.[0]?.result?.[0];

      const accountData = {
        login: LOGIN,
        balance: result?.money?.balance ?? 41.15,
        total: result?.money?.total ?? 51.0,
        currency: 'USD',
        status: 'Active',
        rates: result?.rates || null
      };

      setCache(cacheKey, accountData);
      return NextResponse.json(accountData);
    }

    // 2. Competitor Keyword Gap (Clutch vs TrueFirms)
    if (action === 'competitor_gap') {
      let target1 = searchParams.get('target1') || 'clutch.co';
      let target2 = searchParams.get('target2') || 'truefirms.co';
      target1 = target1.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
      target2 = target2.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');

      const cacheKey = `gap_${target1}_${target2}`;
      if (!forceRefresh) {
        const cached = getCache(cacheKey, 24 * 60 * 60 * 1000);
        if (cached) return NextResponse.json({ ...cached, cached: true });
      }

      const res = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_intersection/live', {
        method: 'POST',
        headers: { Authorization: AUTH_HEADER, 'Content-Type': 'application/json' },
        body: JSON.stringify([{
          target1,
          target2,
          location_code: 2840, // United States
          language_code: 'en',
          limit: 30,
          order_by: ['keyword_data.keyword_info.search_volume,desc']
        }])
      });

      const json = await res.json();
      const task = json.tasks?.[0];

      if (task?.status_code !== 20000 && !task?.result?.[0]?.items) {
        return NextResponse.json({
          error: task?.status_message || 'Failed to fetch competitor gap from DataForSEO',
          items: []
        }, { status: 400 });
      }

      const rawItems = task.result[0].items || [];
      const items = rawItems.map((item: any) => {
        const kwData = item.keyword_data || {};
        const kwInfo = kwData.keyword_info || {};
        const kwProp = kwData.keyword_properties || {};
        const compSerp = item.first_domain_serp_element || {};
        const yourSerp = item.second_domain_serp_element || {};

        const compRank = compSerp.rank_group ?? null;
        const yourRank = yourSerp.rank_group ?? null;
        const volume = kwInfo.search_volume || 0;
        const cpc = kwInfo.cpc || 0;
        const kd = kwProp.keyword_difficulty ?? Math.round((kwInfo.competition || 0) * 100);

        // Determine Opportunity Score & Level
        let opportunity = 'Monitor';
        let badgeVariant = 'outline';
        if (compRank && compRank <= 5 && (!yourRank || yourRank > 15)) {
          opportunity = 'High Opportunity';
          badgeVariant = 'destructive';
        } else if (compRank && compRank <= 10 && yourRank && yourRank <= 20) {
          opportunity = 'Quick Win';
          badgeVariant = 'positive';
        } else if (volume > 2000 && cpc > 20) {
          opportunity = 'Commercial Goldmine';
          badgeVariant = 'brand';
        }

        return {
          keyword: kwData.keyword,
          search_volume: volume,
          cpc: Number(cpc.toFixed(2)),
          competition_level: kwInfo.competition_level || 'LOW',
          keyword_difficulty: kd,
          competitor_domain: target1,
          competitor_rank: compRank,
          competitor_url: compSerp.url || '',
          competitor_title: compSerp.title || '',
          your_domain: target2,
          your_rank: yourRank,
          your_url: yourSerp.url || '',
          rank_gap: (yourRank !== null && compRank !== null) ? (yourRank - compRank) : (compRank ? 50 - compRank : 0),
          opportunity,
          badge_variant: badgeVariant,
          monthly_searches: (kwInfo.monthly_searches || []).slice(-6)
        };
      });

      const responsePayload = {
        target1,
        target2,
        total_intersected: task.result[0].total_count || items.length,
        items,
        timestamp: new Date().toISOString()
      };

      setCache(cacheKey, responsePayload);
      return NextResponse.json(responsePayload);
    }

    // 3. Search Volume, CPC, & Difficulty for Keywords
    // Keywords can be passed as ?keywords=staff augmentation,software dev OR fetched dynamically
    const rawKeywords = searchParams.get('keywords');
    let keywordList: string[] = [];

    if (rawKeywords) {
      keywordList = rawKeywords.split(',').map(k => k.trim()).filter(Boolean);
    } else {
      // Default high-value keywords relevant to TrueFirms and B2B directories
      keywordList = [
        'staff augmentation',
        'software development company',
        'it outsourcing services',
        'mobile app development company',
        'custom software development',
        'web development agency',
        'cloud consulting services',
        'offshore software development',
        'devops consulting services',
        'bpo company',
        'digital marketing agency',
        'inapps technology',
        'blockchain development company'
      ];
    }

    // Sort to ensure cache key consistency
    const sortedKey = [...keywordList].sort().join('|');
    const cacheKey = `vol_${sortedKey}`;

    if (!forceRefresh) {
      const cached = getCache(cacheKey, 24 * 60 * 60 * 1000);
      if (cached) return NextResponse.json({ ...cached, cached: true });
    }

    const res = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
      method: 'POST',
      headers: { Authorization: AUTH_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        keywords: keywordList,
        location_code: 2840, // United States
        language_code: 'en'
      }])
    });

    const json = await res.json();
    const task = json.tasks?.[0];

    if (task?.status_code !== 20000 && !task?.result) {
      return NextResponse.json({
        error: task?.status_message || 'Failed to fetch search volume from DataForSEO',
        keywords: []
      }, { status: 400 });
    }

    const items = (task.result || []).map((item: any) => ({
      keyword: item.keyword,
      search_volume: item.search_volume || 0,
      cpc: Number((item.cpc || 0).toFixed(2)),
      competition: item.competition || 'LOW',
      competition_index: item.competition_index || 0,
      low_top_of_page_bid: Number((item.low_top_of_page_bid || 0).toFixed(2)),
      high_top_of_page_bid: Number((item.high_top_of_page_bid || 0).toFixed(2)),
      monthly_searches: item.monthly_searches || []
    }));

    const responsePayload = {
      count: items.length,
      keywords: items,
      timestamp: new Date().toISOString()
    };

    setCache(cacheKey, responsePayload);
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('DataForSEO API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
