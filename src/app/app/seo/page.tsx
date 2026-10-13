"use client"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Search, MousePointerClick, Eye, Percent, ArrowUpRight, ArrowDownRight, Globe, TrendingUp, AlertCircle, FileText, BarChart3, Filter, ChevronDown, Users, Activity, Target } from "lucide-react"
import { DateRangeModal } from "@/components/ui/date-range-modal"

export default function SEOIntelligencePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [dateRange, setDateRange] = useState("28d"); // 24h, 7d, 28d, 3m, 6m, 12m, 16m, custom
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [customDates, setCustomDates] = useState<{start: string, end: string} | null>(null);
  const [error, setError] = useState("");

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
    };
    window.addEventListener('llm_project_changed', handleProjectChange);
    return () => window.removeEventListener('llm_project_changed', handleProjectChange);

  }, [dateRange, customDates, isHydrated]);

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

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header & Date Range Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            SEO Intelligence <LineChart className="w-6 h-6 text-brand" />
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm">
            Deep analysis of your organic performance from Google Search Console & GA4.
          </p>
        </div>
        
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

          {/* The "More" Button that triggers Modal */}
          <div className="relative h-full">
            <button 
              onClick={() => setIsDateModalOpen(true)}
              className={`px-3 pr-2 h-full font-medium flex items-center gap-1 transition-colors ${
                ['6m', '12m', '16m', 'custom'].includes(dateRange) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              More <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            <DateRangeModal 
              isOpen={isDateModalOpen} 
              onClose={() => setIsDateModalOpen(false)} 
              currentRange={dateRange}
              onApply={(range, start, end) => {
                  setDateRange(range);
                  localStorage.setItem('llm_date_range', range);
                  if (range === 'custom' && start && end) {
                    setCustomDates({ start, end });
                    localStorage.setItem('llm_custom_dates', JSON.stringify({ start, end }));
                  } else {
                    setCustomDates(null);
                    localStorage.removeItem('llm_custom_dates');
                  }
                }}
            />
          </div>
        </div>
      </div>

      {/* Google Search Console KPIs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-semibold px-2.5 py-0.5">
            Google Search Console
          </Badge>
          <span className="text-xs text-slate-500">Organic Search Performance</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <MousePointerClick className="w-16 h-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Clicks (GSC)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{data.clicks.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Search Console Clicks</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Eye className="w-16 h-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Impressions (GSC)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{data.impressions.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Search Console Impressions</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Percent className="w-16 h-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Average CTR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {((data.clicks / (data.impressions || 1)) * 100).toFixed(2)}%
              </div>
              <p className="text-xs text-slate-400 mt-1">Click-through Rate</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <TrendingUp className="w-16 h-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Average Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {((data.timeline?.reduce((acc: any, r: any) => acc + (r.position || 0), 0) || 0) / (data.timeline?.length || 1)).toFixed(1)}
              </div>
              <p className="text-xs text-slate-400 mt-1">Average Organic Rank</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Google Analytics 4 KPIs (Exact match to GA4 Home) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200 font-semibold px-2.5 py-0.5">
            Google Analytics 4 (GA4)
          </Badge>
          <span className="text-xs text-slate-500">Live metrics from your connected GA4 property</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-sky-50/40 border-sky-100">
            <div className="absolute top-0 right-0 p-3 opacity-10 text-sky-600">
              <Users className="w-16 h-16" />
            </div>
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
            <div className="absolute top-0 right-0 p-3 opacity-10 text-indigo-600">
              <Activity className="w-16 h-16" />
            </div>
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
            <div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-600">
              <Target className="w-16 h-16" />
            </div>
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
            <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-600">
              <Eye className="w-16 h-16" />
            </div>
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

      {/* Main Graph */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Visibility Trend ({dateRange})</CardTitle>
          <CardDescription>Organic clicks and impressions over the selected time period.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full mt-4">
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
        {/* Top Queries */}
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" />
              Top Search Queries
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-hide">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-white border-b uppercase sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-medium">Query</th>
                  <th className="px-6 py-4 font-medium text-right">Clicks</th>
                  <th className="px-6 py-4 font-medium text-right">Imp.</th>
                  <th className="px-6 py-4 font-medium text-right">Pos.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.queries.slice(0, 15).map((q: any, idx: number) => (
                  <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900 truncate max-w-[150px]" title={q.keys[0]}>{q.keys[0]}</td>
                    <td className="px-6 py-3 text-right text-brand font-medium">{q.clicks}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{q.impressions.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{q.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Pages */}
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Top Landing Pages
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-hide">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-white border-b uppercase sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-medium">Page Path</th>
                  <th className="px-6 py-4 font-medium text-right">Clicks</th>
                  <th className="px-6 py-4 font-medium text-right">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.pages.slice(0, 15).map((p: any, idx: number) => (
                  <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900 truncate max-w-[200px]" title={p.keys[0]}>
                      {p.keys[0].replace('https://blog.truefirms.co', '').replace('https://www.truefirms.co', '') || '/'}
                    </td>
                    <td className="px-6 py-3 text-right text-brand font-medium">{p.clicks}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{(p.ctr * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  )
}







