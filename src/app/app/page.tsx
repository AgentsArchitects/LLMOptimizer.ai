"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockOverviewData } from "@/data/mock"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowUpRight, ShieldCheck, Zap, Activity, Target, Globe, ChevronDown, CheckSquare, Square, Smartphone, Monitor, Tablet, AlertTriangle, Award, Search } from "lucide-react"
import { DateRangeModal } from "@/components/ui/date-range-modal"

export default function DashboardPage() {
  const [data, setData] = useState<any>(mockOverviewData)
  const [loadingRealData, setLoadingRealData] = useState(true)
  const [gscWarning, setGscWarning] = useState<string | null>(null)
  
  // New States for Site Selection & Date Filter
  const [isHydrated, setIsHydrated] = useState(false)
  const [availableSites, setAvailableSites] = useState<string[]>([])
  const [selectedSite, setSelectedSite] = useState<string>("")
  const [dateRange, setDateRange] = useState("28d") // 24h, 7d, 28d, 3m, 6m, 12m, 16m, custom
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [customDates, setCustomDates] = useState<{start: string, end: string} | null>(null)
  
  const [isCompareMode, setIsCompareMode] = useState(false)
  const [compareRange, setCompareRange] = useState("")
  const [customCompareDates, setCustomCompareDates] = useState<{start: string, end: string} | null>(null)
  const [competitorGaps, setCompetitorGaps] = useState<any[]>([])

  // Hydrate date filters from localStorage
  useEffect(() => {
    try {
      const savedDateRange = localStorage.getItem('llm_date_range');
      const savedCustomDates = localStorage.getItem('llm_custom_dates');
      const savedIsCompare = localStorage.getItem('llm_is_compare');
      const savedCompareRange = localStorage.getItem('llm_compare_range');
      const savedCustomCompare = localStorage.getItem('llm_custom_compare');

      if (savedDateRange) setDateRange(savedDateRange);
      if (savedCustomDates) setCustomDates(JSON.parse(savedCustomDates));
      if (savedIsCompare) setIsCompareMode(savedIsCompare === 'true');
      if (savedCompareRange) setCompareRange(savedCompareRange);
      if (savedCustomCompare) setCustomCompareDates(JSON.parse(savedCustomCompare));
    } catch (e) {
      console.error("Failed to hydrate date settings from local storage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Fetch available sites on mount
  useEffect(() => {
    async function fetchSites() {
      try {
        const res = await fetch('/api/integrations/google/sites')
        const json = await res.json()
        if (json.sites && json.sites.length > 0) {
          setAvailableSites(json.sites)
          
          const savedSite = localStorage.getItem('llm_selected_site')
          if (savedSite && json.sites.includes(savedSite)) {
            setSelectedSite(savedSite)
          } else {
            const defaultSite = json.sites.find((s: string) => s.includes('truefirms.co')) || json.sites[0]
            setSelectedSite(defaultSite)
            localStorage.setItem('llm_selected_site', defaultSite)
          }
        }
      } catch (e) {
        console.error("Failed to load sites", e)
      }
    }
    fetchSites()
  }, [])

  const handleSiteChange = (newSite: string) => {
    setSelectedSite(newSite)
    localStorage.setItem('llm_selected_site', newSite)
  }

  // Fetch DataForSEO Competitor Gap on mount
  useEffect(() => {
    fetch('/api/dataforseo?action=competitor_gap&target1=clutch.co&target2=truefirms.co')
      .then(r => r.json())
      .then(res => {
        if (res.items && Array.isArray(res.items)) {
          setCompetitorGaps(res.items.slice(0, 4));
        }
      })
      .catch(console.error);
  }, []);

    // Re-fetch data whenever date range or active project changes
  useEffect(() => {
    if (!isHydrated) return;
    async function loadRealData() { console.log('loadRealData called, isHydrated:', isHydrated);
      const projectId = localStorage.getItem('llm_active_project_id');
      if (!projectId) return;

      setLoadingRealData(true)
      try {
        let url = '/api/data/truefirms?projectId=' + projectId + '&range=' + dateRange;
        if (dateRange === 'custom' && customDates) {
          url += '&startDate=' + customDates.start + '&endDate=' + customDates.end;
        }
        if (isCompareMode) {
          url += '&compare=true&compareRange=' + compareRange;
          if (compareRange === 'custom' && customCompareDates) {
            url += '&compareStartDate=' + customCompareDates.start + '&compareEndDate=' + customCompareDates.end;
          }
        }
        
        const res = await fetch(url)
        const json = await res.json()
        if (json.gscError) {
          setGscWarning(json.gscError);
        } else {
          setGscWarning(null);
        }

        const timeline = json.timeline || [];
        const totalClicks = timeline.reduce((acc: any, row: any) => acc + (row.clicks || 0), 0);
        const totalImpressions = timeline.reduce((acc: any, row: any) => acc + (row.impressions || 0), 0);
        const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
        const avgPos = timeline.length > 0 ? (timeline.reduce((acc: any, row: any) => acc + (row.position || 0), 0) / timeline.length).toFixed(1) : "0.0";

        setData({
          ...mockOverviewData,
          user: { name: 'Shubham' },
          kpis: {
            clicks: totalClicks,
            impressions: totalImpressions,
            ctr: avgCtr,
            position: avgPos
          },
          trendData: timeline.map((row: any, idx: number) => {
            const compRow = (json.compTimeline && json.compTimeline[idx]) || null;
            return {
              date: (row.keys ? row.keys[0] : '2026-01-01').split('-').slice(1).join('-'),
              clicks: row.clicks || 0,
              impressions: row.impressions || 0,
              ctr: (row.ctr || 0) * 100,
              position: row.position || 0,
              comp_clicks: compRow ? compRow.clicks : undefined,
              comp_impressions: compRow ? compRow.impressions : undefined,
              comp_ctr: compRow ? compRow.ctr * 100 : undefined,
              comp_position: compRow ? compRow.position : undefined
            };
          }),
          ga4: json.ga4 || null,
          opportunities: json.opportunities || null,
          devices: json.devices || [],
          countries: json.countries || []
        } as any)
      } catch(e) {
        console.error(e)
      } finally {
        setLoadingRealData(false)
      }
    }
    
    loadRealData();

    // Listen for global project changes from Sidebar
    const handleProjectChange = () => {
      loadRealData();
    };
    window.addEventListener('llm_project_changed', handleProjectChange);
    return () => window.removeEventListener('llm_project_changed', handleProjectChange);

  }, [dateRange, customDates, isCompareMode, compareRange, customCompareDates, isHydrated])

    // Helper for readable date labels
    const dateLabels: Record<string, string> = {
      '24h': 'Last 24 hours',
      '7d': 'Last 7 days',
      '28d': 'Last 28 days',
      '3m': 'Last 3 months',
      '6m': 'Last 6 months',
      '12m': 'Last 12 months',
      '16m': 'Last 16 months',
      'custom': 'Custom Range'
    };
    const currentLabel = dateLabels[dateRange] || 'Selected Range';

    // Interactive Graph State & Grouping Logic
    const [activeMetrics, setActiveMetrics] = useState({
      clicks: true,
      impressions: true,
      ctr: false,
      position: false
    });
    const [granularity, setGranularity] = useState("Daily");
    
    const toggleMetric = (metric: keyof typeof activeMetrics) => {
      setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
    };

    const processChartData = () => {
      if (!data.trendData || data.trendData.length === 0) return [];
      if (granularity === "Daily" || dateRange === '24h') return data.trendData;
      
      if (granularity === "Weekly") {
        const weeklyData: any[] = [];
        let currentWeek = { date: '', clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 };
        
        data.trendData.forEach((day: any, i: number) => {
          if (i % 7 === 0 && i > 0) {
            weeklyData.push({ 
              ...currentWeek, 
              ctr: currentWeek.ctr / currentWeek.count,
              position: currentWeek.position / currentWeek.count 
            });
            currentWeek = { date: '', clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 };
          }
          if (i % 7 === 0) currentWeek.date = day.date; 
          currentWeek.clicks += day.clicks;
          currentWeek.impressions += day.impressions;
          currentWeek.ctr += day.ctr || 0;
          currentWeek.position += day.position || 0;
          currentWeek.count += 1;
        });
        if (currentWeek.count > 0) {
          weeklyData.push({ 
            ...currentWeek, 
            ctr: currentWeek.ctr / currentWeek.count,
            position: currentWeek.position / currentWeek.count 
          });
        }
        return weeklyData;
      }

      if (granularity === "Monthly") {
        const monthlyData: any[] = [];
        const monthMap: Record<string, any> = {};
        
        data.trendData.forEach((day: any) => {
          const month = day.date.substring(0, 2); // 'MM-DD' -> 'MM'
          if (!monthMap[month]) {
            monthMap[month] = { date: day.date, clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 };
          }
          monthMap[month].clicks += day.clicks;
          monthMap[month].impressions += day.impressions;
          monthMap[month].ctr += day.ctr || 0;
          monthMap[month].position += day.position || 0;
          monthMap[month].count += 1;
        });
        
        Object.values(monthMap).forEach((m: any) => {
          monthlyData.push({ 
            ...m, 
            ctr: m.ctr / m.count,
            position: m.position / m.count 
          });
        });
        
        // Ensure chronological order after object grouping
        return monthlyData.sort((a, b) => a.date.localeCompare(b.date));
      }

      return data.trendData;
    };
    
    const chartData = processChartData();

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Dynamic Site Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Good morning, {data?.user?.name || 'there'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your SEO & AI Visibility performance.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* GSC Style Date Range Filter */}
          <div className="flex items-center bg-background border border-slate-200 rounded-lg shadow-sm overflow-visible text-sm h-[38px] relative">
            {[
              { value: '24h', label: '24 hours' },
              { value: '7d', label: '7 days' },
              { value: '28d', label: '28 days' },
              { value: '3m', label: '3 months' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => { setDateRange(range.value); setCustomDates(null); localStorage.setItem('llm_date_range', range.value); localStorage.removeItem('llm_custom_dates'); }}
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
                onApply={(range, start, end, isCompare, compRange, compCustom) => {
                  setDateRange(range);
                  localStorage.setItem('llm_date_range', range);
                  
                  if (range === 'custom' && start && end) {
                    setCustomDates({ start, end });
                    localStorage.setItem('llm_custom_dates', JSON.stringify({ start, end }));
                  } else {
                    setCustomDates(null);
                    localStorage.removeItem('llm_custom_dates');
                  }
                  
                  setIsCompareMode(!!isCompare);
                  localStorage.setItem('llm_is_compare', String(!!isCompare));
                  
                  if (isCompare && compRange) {
                    setCompareRange(compRange);
                    localStorage.setItem('llm_compare_range', compRange);
                    if (compRange === 'custom' && compCustom) {
                      setCustomCompareDates(compCustom);
                      localStorage.setItem('llm_custom_compare', JSON.stringify(compCustom));
                    } else {
                      setCustomCompareDates(null);
                      localStorage.removeItem('llm_custom_compare');
                    }
                  } else {
                    setCompareRange('');
                    setCustomCompareDates(null);
                    localStorage.removeItem('llm_compare_range');
                    localStorage.removeItem('llm_custom_compare');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GSC Permission Warning Banner */}
      {gscWarning && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Google Search Console Permission Warning</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {gscWarning.includes("permission") 
                  ? "Your connected Google account is not a verified owner for the currently selected property (e.g. unverified domain). Please select a verified site in Integrations or verify ownership in Search Console." 
                  : gscWarning}
              </p>
            </div>
          </div>
          <Link href="/app/integrations">
            <Button size="sm" className="bg-brand text-white hover:bg-brand/90 text-xs shrink-0 font-semibold gap-1.5 shadow-sm">
              Change Property in Integrations
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Top Overview Cards (Real GSC Data) - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
        
        {/* Clicks Card */}
        <div 
          onClick={() => toggleMetric('clicks')}
          className={`p-4 md:p-5 cursor-pointer border-r border-b md:border-b-0 border-slate-200 transition-colors ${
            activeMetrics.clicks ? 'bg-[#4285f4] text-white' : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {activeMetrics.clicks ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span className={`text-sm font-medium ${activeMetrics.clicks ? 'text-white' : 'text-slate-600'}`}>Total clicks</span>
          </div>
          <div className="text-3xl font-semibold mt-3">{loadingRealData ? "..." : ((data?.kpis as any)?.clicks ?? 0).toLocaleString()}</div>
        </div>

        {/* Impressions Card */}
        <div 
          onClick={() => toggleMetric('impressions')}
          className={`p-4 md:p-5 cursor-pointer border-b md:border-b-0 md:border-r border-slate-200 transition-colors ${
            activeMetrics.impressions ? 'bg-[#5e35b1] text-white' : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {activeMetrics.impressions ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span className={`text-sm font-medium ${activeMetrics.impressions ? 'text-white' : 'text-slate-600'}`}>Total impressions</span>
          </div>
          <div className="text-3xl font-semibold mt-3">{loadingRealData ? "..." : ((data?.kpis as any)?.impressions ?? 0).toLocaleString()}</div>
        </div>

        {/* CTR Card */}
        <div 
          onClick={() => toggleMetric('ctr')}
          className={`p-4 md:p-5 cursor-pointer border-r border-slate-200 transition-colors ${
            activeMetrics.ctr ? 'bg-[#0f9d58] text-white' : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {activeMetrics.ctr ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span className={`text-sm font-medium ${activeMetrics.ctr ? 'text-white' : 'text-slate-600'}`}>Average CTR</span>
          </div>
          <div className="text-3xl font-semibold mt-3">{loadingRealData ? "..." : `${(data?.kpis as any)?.ctr ?? "0.00"}%`}</div>
        </div>

        {/* Position Card */}
        <div 
          onClick={() => toggleMetric('position')}
          className={`p-4 md:p-5 cursor-pointer transition-colors ${
            activeMetrics.position ? 'bg-[#e67c73] text-white' : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {activeMetrics.position ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span className={`text-sm font-medium ${activeMetrics.position ? 'text-white' : 'text-slate-600'}`}>Average position</span>
          </div>
          <div className="text-3xl font-semibold mt-3">{loadingRealData ? "..." : ((data?.kpis as any)?.position ?? "0.0")}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-5 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-500 font-medium tracking-wide text-xs uppercase">
              Performance over time ({currentLabel})
            </CardDescription>
            <div className="flex items-center border border-slate-300 rounded overflow-hidden h-[36px] bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <select 
                value={granularity} 
                onChange={(e) => setGranularity(e.target.value)}
                className="bg-transparent px-3 text-sm font-medium text-slate-700 outline-none cursor-pointer appearance-none pr-8 relative"
                disabled={dateRange === '24h'}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
              >
                {dateRange === '24h' && <option value="Hourly">Hourly</option>}
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                  
                  {/* Base Axes that are visible */}
                  {(activeMetrics.clicks || (!activeMetrics.clicks && !activeMetrics.impressions && activeMetrics.ctr)) && (
                    <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  )}
                  {(activeMetrics.impressions || (!activeMetrics.clicks && !activeMetrics.impressions && activeMetrics.position)) && (
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={10} />
                  )}
                  
                  {/* Hidden Axes for CTR and Position to allow independent auto-scaling */}
                  {activeMetrics.ctr && (
                    <YAxis yAxisId="ctr" hide={true} domain={['auto', 'auto']} />
                  )}
                  {activeMetrics.position && (
                    <YAxis yAxisId="position" hide={true} reversed={true} domain={['auto', 'auto']} />
                  )}
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                  />
                  
                  {activeMetrics.clicks && <Line yAxisId="left" type="monotone" dataKey="clicks" name="Clicks" stroke="#4285f4" strokeWidth={2} dot={{r: 4, strokeWidth: 0, fill: '#4285f4'}} activeDot={{r: 6}} />}
                  {activeMetrics.impressions && <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke="#5e35b1" strokeWidth={2} dot={{r: 4, strokeWidth: 0, fill: '#5e35b1'}} activeDot={{r: 6}} />}
                  {activeMetrics.ctr && <Line yAxisId="ctr" type="monotone" dataKey="ctr" name="CTR" stroke="#0f9d58" strokeWidth={2} dot={{r: 4, strokeWidth: 0, fill: '#0f9d58'}} activeDot={{r: 6}} />}
                  {activeMetrics.position && <Line yAxisId="position" type="monotone" dataKey="position" name="Position" stroke="#e67c73" strokeWidth={2} dot={{r: 4, strokeWidth: 0, fill: '#e67c73'}} activeDot={{r: 6}} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Intelligent Insight */}
        <Card className="col-span-1 lg:col-span-2 bg-gradient-to-b from-brand/5 to-transparent border-brand/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-brand" />
              <CardTitle>What's changed?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.insights.map((insight: any, i: any) => (
              <div key={i} className="space-y-3">
                <p className="font-medium text-foreground">{insight.title}</p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Likely contributors:</p>
                  <ul className="space-y-2">
                    {insight.contributors.map((c: any, j: any) => (
                      <li key={j} className="text-sm flex items-start gap-2">
                        <span className="text-brand mt-0.5">•</span>
                        <span className="text-muted-foreground">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="bg-background">Confidence: {insight.confidence}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Unified Intelligence: GSC + GA4 Anomalies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Unified Intelligence Opportunities</h2>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">GSC + GA4 Blended</Badge>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* High Traffic, Low Ranking */}
          <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>High Traffic, Low Ranking</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-700">GA4: Sessions</Badge>
                  <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700">GSC: Position</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Pages receiving high visitors/impressions but ranking poorly (Pos &gt; 10) in search. Immediate SEO targets.
              </p>
              <div className="space-y-2">
                {data.opportunities?.highTrafficLowRank && data.opportunities.highTrafficLowRank.length > 0 ? (
                  data.opportunities.highTrafficLowRank.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-md p-2.5 text-sm flex justify-between items-center hover:bg-slate-100/70 transition-colors">
                      <span className="font-medium truncate max-w-[200px] text-slate-800" title={item.path}>{item.path}</span>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="block font-bold text-orange-600 text-xs">
                          {item.sessions > 0 ? `${item.sessions.toLocaleString()} Sessions` : `${item.impressions.toLocaleString()} Impr.`}
                        </span>
                        <span className="block text-[11px] text-slate-500">Avg Pos: {Number(item.position).toFixed(1)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 rounded-md p-3 text-xs text-muted-foreground text-center">No low-ranking traffic anomalies found.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* High Impressions, Low CTR */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>High Impressions, Low CTR</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700">GSC: Impressions</Badge>
                  <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-700">Meta Optimize</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                High search visibility but low click rate (CTR &lt; 3%). Rewriting page titles & meta descriptions will unlock traffic.
              </p>
              <div className="space-y-2">
                {data.opportunities?.highImprLowCtr && data.opportunities.highImprLowCtr.length > 0 ? (
                  data.opportunities.highImprLowCtr.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-md p-2.5 text-sm flex justify-between items-center hover:bg-slate-100/70 transition-colors">
                      <span className="font-medium truncate max-w-[200px] text-slate-800" title={item.path}>{item.path}</span>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="block font-bold text-blue-600 text-xs">{item.impressions.toLocaleString()} Impr.</span>
                        <span className="block text-[11px] text-amber-600">{(item.ctr * 100).toFixed(2)}% CTR</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 rounded-md p-3 text-xs text-muted-foreground text-center">No high impression / low CTR anomalies found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Audience Demographics: Devices & Countries */}
      <div>
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Audience Breakdown</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Devices & Geography</Badge>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Device Distribution */}
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-500" />
                Traffic by Device
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {(data.devices || []).length > 0 ? (
                  data.devices.map((d: any) => {
                    const totalClicks = (data.devices || []).reduce((acc: number, item: any) => acc + (item.clicks || 0), 0) || 1;
                    const percent = Math.round((d.clicks / totalClicks) * 100);
                    const DeviceIcon = d.device.toLowerCase().includes('mobile') ? Smartphone : (d.device.toLowerCase().includes('tablet') ? Tablet : Monitor);
                    return (
                      <div key={d.device} className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium flex items-center gap-2 text-slate-700">
                            <DeviceIcon className="w-4 h-4 text-slate-400" />
                            {d.device}
                          </span>
                          <span className="text-xs text-slate-500">
                            <strong className="text-slate-800 font-semibold">{d.clicks.toLocaleString()}</strong> clicks ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full ${d.device.toLowerCase().includes('desktop') ? 'bg-blue-600' : d.device.toLowerCase().includes('mobile') ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">No device data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="divide-y divide-slate-100">
                {(data.countries || []).length > 0 ? (
                  data.countries.slice(0, 5).map((c: any) => (
                    <div key={c.code} className="py-2.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{c.code}</span>
                        <span className="font-medium text-slate-800">{c.country}</span>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-semibold text-slate-900">{c.clicks.toLocaleString()} clicks</span>
                        <span className="text-slate-400 ml-2">({c.impressions.toLocaleString()} imp)</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">No country data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitor Gap & High-Value Opportunities (DataForSEO) */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Competitor Gap Intelligence</h2>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 font-semibold gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
              DataForSEO Live • Clutch.co vs TrueFirms
            </Badge>
          </div>
          <Link href="/app/seo">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 font-semibold text-slate-700 hover:text-purple-700">
              Explore All 199+ Gap Keywords <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {competitorGaps.length > 0 ? (
            competitorGaps.map((item: any, idx: number) => (
              <Card key={idx} className="border-slate-200/80 shadow-sm hover:shadow transition-shadow bg-white flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <Badge variant={item.opportunity === 'High Opportunity' ? 'destructive' : item.opportunity === 'Quick Win' ? 'positive' : 'brand'} className="text-[10px]">
                      {item.opportunity}
                    </Badge>
                    <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      ${item.cpc.toFixed(2)} CPC
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 truncate" title={item.keyword}>
                    {item.keyword}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Monthly Vol: <strong className="text-slate-800">{item.search_volume.toLocaleString()}</strong> searches
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs mt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Clutch</span>
                      <span className="font-bold text-purple-700">#{item.competitor_rank}</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">TrueFirms</span>
                      <span className="font-bold text-slate-700">{item.your_rank ? `#${item.your_rank}` : '> 50'}</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">KD</span>
                      <span className="font-bold text-slate-600">{item.keyword_difficulty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-4 p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
              Loading DataForSEO competitor insights...
            </div>
          )}
        </div>
      </div>

      {/* Recommended Actions */}
      <div>
        <div className="flex items-center justify-between mb-4 mt-8">
          <h2 className="text-xl font-bold tracking-tight">Recommended actions</h2>
          <Button variant="outline" size="sm">View all actions</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.actions.map((action: any) => (
            <Card key={action.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <Badge variant={action.status === 'Awaiting approval' ? 'warning' : 'secondary'}>
                    {action.status}
                  </Badge>
                  <div className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-muted-foreground">
                    ICE {action.ice}
                  </div>
                </div>
                <CardTitle className="text-base leading-tight">{action.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 flex-1">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Problem / Evidence</span>
                    <p className="text-sm mt-0.5">{action.evidence}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-t pt-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Impact</span>
                      <p className="text-sm font-medium truncate">{action.impact}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Effort</span>
                      <p className="text-sm font-medium">{action.effort}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 justify-between border-t p-4 mt-auto">
                <span className="text-xs text-muted-foreground flex items-center">
                  <UsersIcon className="w-3 h-3 mr-1" />
                  {action.owner}
                </span>
                <Button size="sm" variant={action.status === 'Awaiting approval' ? 'default' : 'secondary'}>
                  {action.status === 'Awaiting approval' ? 'Review' : 'View Details'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  )
}

function UsersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}




















