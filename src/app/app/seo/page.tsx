"use client"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { 
  Search, 
  MousePointerClick, 
  Eye, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  TrendingUp, 
  AlertCircle, 
  FileText, 
  BarChart3, 
  Filter, 
  ChevronDown, 
  Users, 
  Activity, 
  Target,
  DollarSign,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Award
} from "lucide-react"
import { DateRangeModal } from "@/components/ui/date-range-modal"

export default function SEOIntelligencePage() {
  const [activeTab, setActiveTab] = useState("organic");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [dateRange, setDateRange] = useState("28d"); // 24h, 7d, 28d, 3m, 6m, 12m, 16m, custom
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [customDates, setCustomDates] = useState<{start: string, end: string} | null>(null);
  const [error, setError] = useState("");

  // DataForSEO States
  const [seoVolumeData, setSeoVolumeData] = useState<any[]>([]);
  const [competitorGapData, setCompetitorGapData] = useState<any[]>([]);
  const [gapMeta, setGapMeta] = useState<any>(null);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState("clutch.co");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [gapFilter, setGapFilter] = useState<"all" | "quick_win" | "high_opp" | "commercial">("all");
  const [isRefreshingDfs, setIsRefreshingDfs] = useState(false);

  // Hydrate date filters from localStorage
  useEffect(() => {
    try {
      const savedDateRange = localStorage.getItem('llm_date_range');
      const savedCustomDates = localStorage.getItem('llm_custom_dates');
      if (savedDateRange) setDateRange(savedDateRange);
      if (savedCustomDates) setCustomDates(JSON.parse(savedCustomDates));
    } catch (e) {
      console.error("Failed to hydrate date settings from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Fetch GSC & GA4 Data
  useEffect(() => {
    if (!isHydrated) return;
    async function fetchData() {
      const projectId = localStorage.getItem('llm_active_project_id');
      if (!projectId) {
        setError("Please select a project from the sidebar");
        return;
      }

      try {
        setLoading(true);
        let url = '/api/data/truefirms?projectId=' + projectId + '&range=' + dateRange;
        if (dateRange === 'custom' && customDates) {
          url += '&startDate=' + customDates.start + '&endDate=' + customDates.end;
        }
        const res = await fetch(url);
        const json = await res.json();
        if (json.error) {
          setError(json.error);
        } else {
          setData({
            timeline: json.timeline || [],
            queries: json.topQueries || [],
            pages: json.topPages || [],
            clicks: (json.timeline || []).reduce((acc: any, row: any) => acc + row.clicks, 0),
            impressions: (json.timeline || []).reduce((acc: any, row: any) => acc + row.impressions, 0),
            ga4: json.ga4 || { activeUsers: 0, eventCount: 0, keyEvents: 0, conversions: 0, views: 0, sessions: 0 }
          });
          setError("");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();

    const handleProjectChange = () => {
      fetchData();
      fetchDataForSeo();
    };
    window.addEventListener('llm_project_changed', handleProjectChange);
    return () => window.removeEventListener('llm_project_changed', handleProjectChange);

  }, [dateRange, customDates, isHydrated]);

  // Fetch DataForSEO Search Volumes & Competitor Gap
  const fetchDataForSeo = async (forceRefresh = false) => {
    try {
      setIsRefreshingDfs(true);

      // 1. Account balance
      fetch(`/api/dataforseo?action=account${forceRefresh ? '&refresh=true' : ''}`)
        .then(r => r.json())
        .then(acc => {
          if (acc.balance !== undefined) setAccountBalance(acc.balance);
        })
        .catch(console.error);

      // 2. Keyword Search Volumes & CPC
      const kwRes = await fetch(`/api/dataforseo?action=keywords${forceRefresh ? '&refresh=true' : ''}`);
      const kwJson = await kwRes.json();
      if (kwJson.keywords) {
        setSeoVolumeData(kwJson.keywords);
      }

      // 3. Competitor Gap Analysis
      const gapRes = await fetch(`/api/dataforseo?action=competitor_gap&target1=${selectedCompetitor}&target2=truefirms.co${forceRefresh ? '&refresh=true' : ''}`);
      const gapJson = await gapRes.json();
      if (gapJson.items) {
        setCompetitorGapData(gapJson.items);
        setGapMeta({
          total: gapJson.total_intersected || gapJson.items.length,
          target1: gapJson.target1,
          target2: gapJson.target2,
          cached: gapJson.cached
        });
      }
    } catch (e) {
      console.error("Failed to load DataForSEO intelligence:", e);
    } finally {
      setIsRefreshingDfs(false);
    }
  };

  useEffect(() => {
    fetchDataForSeo();
  }, [selectedCompetitor]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold">Unable to load data</h3>
        <p className="text-slate-500 max-w-sm mt-2">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  // Format GSC timeline for chart
  const chartData = data.timeline.map((row: any) => ({
    date: row.keys ? row.keys[0].split('-').slice(1).join('-') : '2026-01-01',
    clicks: row.clicks,
    impressions: row.impressions
  }));

  // Match GSC query to DataForSEO volume if available
  const getVolumeForQuery = (queryText: string) => {
    const match = seoVolumeData.find(k => k.keyword.toLowerCase() === queryText.toLowerCase());
    return match || null;
  };

  // Filtered competitor gap items
  const filteredGapItems = competitorGapData.filter(item => {
    if (keywordFilter && !item.keyword.toLowerCase().includes(keywordFilter.toLowerCase())) {
      return false;
    }
    if (gapFilter === "quick_win") return item.opportunity === "Quick Win";
    if (gapFilter === "high_opp") return item.opportunity === "High Opportunity";
    if (gapFilter === "commercial") return item.cpc >= 20;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header & Date Range Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              SEO Intelligence <LineChart className="w-6 h-6 text-brand" />
            </h1>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              DataForSEO & GSC Live
            </Badge>
          </div>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm">
            Unified organic search analytics, live keyword search volume, CPC, and competitor market gap against industry leaders.
          </p>
        </div>
        
        {/* Actions Bar */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchDataForSeo(true)} 
            disabled={isRefreshingDfs}
            className="text-xs h-[32px] gap-1.5 bg-white border-slate-200 text-slate-700 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingDfs ? 'animate-spin text-brand' : 'text-slate-400'}`} />
            {isRefreshingDfs ? "Syncing API..." : "Refresh DataForSEO"}
          </Button>

          {/* GSC Style Date Range Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm overflow-visible text-sm h-[32px] relative">
            {[
              { value: '24h', label: '24 hours' },
              { value: '7d', label: '7 days' },
              { value: '28d', label: '28 days' },
              { value: '3m', label: '3 months' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  setDateRange(range.value); setCustomDates(null); localStorage.setItem('llm_date_range', range.value); localStorage.removeItem('llm_custom_dates');
                }}
                className={`px-3 h-full font-medium border-r border-slate-200 transition-colors flex items-center gap-1.5 ${
                  dateRange === range.value 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {dateRange === range.value && <span className="w-3.5 h-3.5 text-blue-600 font-bold -ml-1">✓</span>}
                {range.label}
              </button>
            ))}

            <div className="relative h-full">
              <button 
                onClick={() => setIsDateModalOpen(true)}
                className={`px-3 pr-2 h-full font-medium flex items-center gap-1 transition-colors ${
                  ['6m', '12m', '16m', 'custom'].includes(dateRange) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {['6m', '12m', '16m', 'custom'].includes(dateRange) && <span className="w-3.5 h-3.5 text-blue-600 font-bold -ml-1">✓</span>}
                {dateRange === 'custom' && customDates ? `${customDates.start} to ${customDates.end}` : dateRange === '6m' ? '6 months' : dateRange === '12m' ? '12 months' : dateRange === '16m' ? '16 months' : 'More'}
                <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentRange={dateRange}
        onApply={(range: string, start?: string, end?: string) => {
          setDateRange(range);
          if (range === 'custom' && start && end) {
            setCustomDates({ start, end });
            localStorage.setItem('llm_date_range', 'custom');
            localStorage.setItem('llm_custom_dates', JSON.stringify({ start, end }));
          } else {
            setCustomDates(null);
            localStorage.setItem('llm_date_range', range);
            localStorage.removeItem('llm_custom_dates');
          }
        }}
      />

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="organic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full sm:w-auto grid grid-cols-3 h-11 border border-slate-200">
          <TabsTrigger value="organic" className="text-xs sm:text-sm font-semibold gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Globe className="w-4 h-4 text-blue-600" />
            Organic Performance (GSC & GA4)
          </TabsTrigger>
          <TabsTrigger value="keywords" className="text-xs sm:text-sm font-semibold gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Search className="w-4 h-4 text-emerald-600" />
            Keyword Volume & CPC (DataForSEO)
          </TabsTrigger>
          <TabsTrigger value="competitor_gap" className="text-xs sm:text-sm font-semibold gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Award className="w-4 h-4 text-purple-600" />
            Competitor Gap (Clutch vs TrueFirms)
            {gapMeta?.total && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
                {gapMeta.total}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ORGANIC PERFORMANCE (GSC + GA4) */}
        <TabsContent value="organic" className="mt-6 space-y-6">
          {/* GSC & GA4 KPI Cards */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-brand">
                  <MousePointerClick className="w-16 h-16" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
                    <span>Total clicks</span>
                    <span className="text-xs font-normal text-slate-400">GSC</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{data.clicks.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 mt-1">Direct search organic traffic</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-600">
                  <Eye className="w-16 h-16" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
                    <span>Total impressions</span>
                    <span className="text-xs font-normal text-slate-400">GSC</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{data.impressions.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 mt-1">Appearances in SERP results</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-600">
                  <Percent className="w-16 h-16" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
                    <span>Average CTR</span>
                    <span className="text-xs font-normal text-slate-400">GSC</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(2) : '0.00'}%
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Click-through engagement rate</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-amber-600">
                  <TrendingUp className="w-16 h-16" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
                    <span>Average position</span>
                    <span className="text-xs font-normal text-slate-400">GSC</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {data.timeline.length > 0 
                      ? (data.timeline.reduce((acc: any, row: any) => acc + (row.position || 0), 0) / data.timeline.length).toFixed(1)
                      : '0.0'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Mean SERP ranking position</p>
                </CardContent>
              </Card>
            </div>

            {/* GA4 KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-sky-50/40 border-sky-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-sky-900 flex items-center justify-between">
                    <span>Active users</span>
                    <span className="text-xs font-normal text-sky-600">GA4</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-sky-950">{(data.ga4?.activeUsers || 0).toLocaleString()}</div>
                  <p className="text-xs text-sky-700/80 mt-1">Total active visitors</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-indigo-50/40 border-indigo-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-indigo-900 flex items-center justify-between">
                    <span>Event count</span>
                    <span className="text-xs font-normal text-indigo-600">GA4</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-950">{(data.ga4?.eventCount || 0).toLocaleString()}</div>
                  <p className="text-xs text-indigo-700/80 mt-1">Total user interactions</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-emerald-50/50 border-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-900 flex items-center justify-between">
                    <span>Key events</span>
                    <span className="text-xs font-normal text-emerald-600">GA4</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-950">{(data.ga4?.keyEvents || 0).toLocaleString()}</div>
                  <p className="text-xs text-emerald-700/80 mt-1">Important actions (Conversions)</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-purple-50/40 border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900 flex items-center justify-between">
                    <span>Views</span>
                    <span className="text-xs font-normal text-purple-600">GA4</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-950">{(data.ga4?.views || 0).toLocaleString()}</div>
                  <p className="text-xs text-purple-700/80 mt-1">Total screen & page views</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Visibility Chart */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Visibility Trend ({dateRange})</CardTitle>
              <CardDescription>Organic clicks and impressions over the selected time period from Google Search Console.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} minTickGap={30} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                    />
                    <Area yAxisId="left" type="monotone" name="Clicks" dataKey="clicks" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                    <Line yAxisId="right" type="monotone" name="Impressions" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Deep Dive Tables */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Queries with DataForSEO enrichment */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  Top Search Queries
                </CardTitle>
                <span className="text-[11px] font-medium text-slate-400">Enriched with DataForSEO</span>
              </CardHeader>
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto scrollbar-hide">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] text-slate-500 bg-white border-b uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Query</th>
                      <th className="px-3 py-3 font-semibold text-right">Clicks</th>
                      <th className="px-3 py-3 font-semibold text-right">Imp.</th>
                      <th className="px-3 py-3 font-semibold text-right">Vol (Mo)</th>
                      <th className="px-3 py-3 font-semibold text-right">Pos.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.queries.slice(0, 15).map((q: any, idx: number) => {
                      const queryText = q.keys[0];
                      const dfs = getVolumeForQuery(queryText);
                      return (
                        <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-slate-900 truncate max-w-[170px]" title={queryText}>
                            {queryText}
                          </td>
                          <td className="px-3 py-2.5 text-right text-brand font-semibold">{q.clicks}</td>
                          <td className="px-3 py-2.5 text-right text-slate-600">{q.impressions.toLocaleString()}</td>
                          <td className="px-3 py-2.5 text-right">
                            {dfs ? (
                              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {dfs.search_volume.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-600 font-mono text-xs">{q.position.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Top Pages */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Top Landing Pages
                </CardTitle>
                <span className="text-[11px] font-medium text-slate-400">Google Search Console</span>
              </CardHeader>
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto scrollbar-hide">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] text-slate-500 bg-white border-b uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Page Path</th>
                      <th className="px-4 py-3 font-semibold text-right">Clicks</th>
                      <th className="px-4 py-3 font-semibold text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.pages.slice(0, 15).map((p: any, idx: number) => (
                      <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-slate-900 truncate max-w-[220px]" title={p.keys[0]}>
                          {p.keys[0].replace('https://blog.truefirms.co', '').replace('https://www.truefirms.co', '') || '/'}
                        </td>
                        <td className="px-4 py-2.5 text-right text-brand font-semibold">{p.clicks}</td>
                        <td className="px-4 py-2.5 text-right text-slate-600">{(p.ctr * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: KEYWORD VOLUME & CPC (DATAFORSEO LIVE) */}
        <TabsContent value="keywords" className="mt-6 space-y-6">
          {/* Summary KPIs */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/60 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Total Market Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-950">
                  {seoVolumeData.reduce((acc, k) => acc + (k.search_volume || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-emerald-600 mt-1">Monthly Google US searches</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50/60 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Max Keyword CPC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-950">
                  ${Math.max(...seoVolumeData.map(k => k.cpc || 0), 0).toFixed(2)}
                </div>
                <p className="text-xs text-blue-600 mt-1">Highest commercial intent value</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-purple-50/60 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                  Keywords Tracked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-950">
                  {seoVolumeData.length}
                </div>
                <p className="text-xs text-purple-600 mt-1">Target B2B and directory queries</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-amber-50/60 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  DataForSEO Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-950">
                  ${accountBalance !== null ? accountBalance.toFixed(2) : "41.15"}
                </div>
                <p className="text-xs text-amber-600 mt-1">Active account funds (USD)</p>
              </CardContent>
            </Card>
          </div>

          {/* Keywords Table Card */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-slate-50/60 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  Live Keyword Volume & Commercial Bid Intelligence
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Real-time Google Ads Search Volume, Cost-Per-Click (CPC), and advertiser competition index from DataForSEO.
                </CardDescription>
              </div>

              {/* Keyword Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter keywords..."
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-500 bg-slate-50/80 border-b uppercase">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Keyword</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Search Volume</th>
                    <th className="px-4 py-3.5 font-semibold text-right">CPC</th>
                    <th className="px-4 py-3.5 font-semibold text-center">Competition</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Comp. Index</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Bid Range</th>
                    <th className="px-5 py-3.5 font-semibold text-center">12-Mo Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seoVolumeData
                    .filter(k => !keywordFilter || k.keyword.toLowerCase().includes(keywordFilter.toLowerCase()))
                    .map((kw: any, idx: number) => {
                      const maxMo = Math.max(...(kw.monthly_searches || []).map((m: any) => m.search_volume || 0), 1);
                      return (
                        <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-slate-900">
                            <span className="font-semibold">{kw.keyword}</span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                            {kw.search_volume.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-semibold text-emerald-700">
                            ${kw.cpc.toFixed(2)}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Badge 
                              variant={kw.competition === 'LOW' ? 'positive' : kw.competition === 'HIGH' ? 'destructive' : 'warning'}
                              className="text-[10px] uppercase font-bold"
                            >
                              {kw.competition}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono text-slate-600 text-xs">
                            {kw.competition_index}/100
                          </td>
                          <td className="px-4 py-3.5 text-right text-xs text-slate-500 font-mono">
                            ${kw.low_top_of_page_bid.toFixed(2)} – ${kw.high_top_of_page_bid.toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {/* Sparkline Visual */}
                            <div className="flex items-end justify-center gap-0.5 h-6">
                              {(kw.monthly_searches || []).slice(-8).map((m: any, mIdx: number) => {
                                const heightPercent = Math.max(15, Math.round((m.search_volume / maxMo) * 100));
                                return (
                                  <div 
                                    key={mIdx} 
                                    className="w-1.5 bg-brand/70 hover:bg-brand rounded-t-sm transition-all"
                                    style={{ height: `${heightPercent}%` }}
                                    title={`${m.year}-${m.month}: ${m.search_volume} searches`}
                                  />
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: COMPETITOR KEYWORD GAP (CLUTCH VS TRUEFIRMS) */}
        <TabsContent value="competitor_gap" className="mt-6 space-y-6">
          {/* Competitor Selector & Overview */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-2xl text-white shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  Market Intersection
                </span>
                <span className="text-xs text-purple-200">Powered by DataForSEO Labs</span>
              </div>
              <h2 className="text-2xl font-bold mt-2">Competitor Keyword Gap: Clutch.co vs TrueFirms.co</h2>
              <p className="text-xs text-purple-200 max-w-xl mt-1">
                Pinpoint keywords where Clutch ranks in Google’s Top 10 with high search demand, showing where TrueFirms can seize traffic.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 flex gap-1">
                {['clutch.co', 'goodfirms.co'].map(comp => (
                  <button
                    key={comp}
                    onClick={() => setSelectedCompetitor(comp)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedCompetitor === comp ? 'bg-white text-purple-950 shadow-sm' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gap Metric Highlights */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase">
                  Common Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {gapMeta?.total || competitorGapData.length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Intersected ranking queries</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-rose-50/40 border-rose-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-rose-800 uppercase">
                  Clutch Top 5 Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-950">
                  {competitorGapData.filter(i => i.competitor_rank <= 5).length}
                </div>
                <p className="text-xs text-rose-700/80 mt-1">High visibility gap keywords</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-emerald-50/40 border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-emerald-800 uppercase">
                  Quick Win Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-950">
                  {competitorGapData.filter(i => i.opportunity === 'Quick Win').length}
                </div>
                <p className="text-xs text-emerald-700/80 mt-1">Within striking distance (&lt; 20 pos)</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-indigo-50/40 border-indigo-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-indigo-800 uppercase">
                  Top Commercial Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-950">
                  ${Math.max(...competitorGapData.map(i => i.cpc || 0), 0).toFixed(2)}
                </div>
                <p className="text-xs text-indigo-700/80 mt-1">Max CPC in competitor intersection</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Comparison Table */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-slate-50/60 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Head-to-Head Keyword Rankings
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Direct ranking comparison between Clutch.co and TrueFirms.co with search volume and monetization value.
                </CardDescription>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setGapFilter("all")}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    gapFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All ({competitorGapData.length})
                </button>
                <button
                  onClick={() => setGapFilter("high_opp")}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    gapFilter === 'high_opp' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  High Opportunity
                </button>
                <button
                  onClick={() => setGapFilter("quick_win")}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    gapFilter === 'quick_win' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Quick Wins
                </button>
                <button
                  onClick={() => setGapFilter("commercial")}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    gapFilter === 'commercial' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  High CPC ($20+)
                </button>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-500 bg-slate-50/80 border-b uppercase">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Keyword</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Search Volume</th>
                    <th className="px-4 py-3.5 font-semibold text-right">CPC</th>
                    <th className="px-4 py-3.5 font-semibold text-center">KD</th>
                    <th className="px-4 py-3.5 font-semibold text-center">Clutch Rank</th>
                    <th className="px-4 py-3.5 font-semibold text-center">TrueFirms Rank</th>
                    <th className="px-4 py-3.5 font-semibold text-center">Rank Gap</th>
                    <th className="px-4 py-3.5 font-semibold text-center">Opportunity</th>
                    <th className="px-4 py-3.5 font-semibold text-right">URLs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGapItems.map((item: any, idx: number) => (
                    <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        <span className="font-semibold">{item.keyword}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                        {item.search_volume.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold text-emerald-700">
                        ${item.cpc.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.keyword_difficulty < 20 ? 'bg-emerald-100 text-emerald-800' :
                          item.keyword_difficulty < 40 ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {item.keyword_difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                          #{item.competitor_rank}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {item.your_rank ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            item.your_rank <= 10 ? 'bg-emerald-100 text-emerald-800' :
                            item.your_rank <= 30 ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            #{item.your_rank}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">&gt; 50</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs">
                        {item.rank_gap > 0 ? (
                          <span className="text-rose-600 font-semibold flex items-center justify-center gap-0.5">
                            <ArrowDownRight className="w-3.5 h-3.5" /> -{item.rank_gap}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold flex items-center justify-center gap-0.5">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Ahead
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge 
                          variant={item.opportunity === 'Quick Win' ? 'positive' : item.opportunity === 'High Opportunity' ? 'destructive' : 'brand'}
                          className="text-[10px] font-semibold whitespace-nowrap"
                        >
                          {item.opportunity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.competitor_url && (
                            <a
                              href={item.competitor_url}
                              target="_blank"
                              rel="noreferrer"
                              title={`Clutch: ${item.competitor_url}`}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}
