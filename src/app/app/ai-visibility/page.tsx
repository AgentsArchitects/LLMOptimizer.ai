"use client"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Sparkles, ArrowUpRight, TrendingUp, Search, MessagesSquare, Percent, Filter, Plus, RefreshCw, CheckCircle2, XCircle, Bot, ExternalLink, X } from "lucide-react"

// Initial fallback trend data
const defaultTrendData = [
  { date: 'Oct 01', chatgpt: 45, gemini: 30, claude: 35 },
  { date: 'Oct 05', chatgpt: 48, gemini: 35, claude: 38 },
  { date: 'Oct 10', chatgpt: 52, gemini: 38, claude: 42 },
  { date: 'Oct 15', chatgpt: 50, gemini: 42, claude: 40 },
  { date: 'Oct 20', chatgpt: 65, gemini: 48, claude: 55 },
  { date: 'Oct 25', chatgpt: 72, gemini: 55, claude: 60 },
  { date: 'Oct 30', chatgpt: 76, gemini: 58, claude: 64 },
]

export default function AIVisibilityPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [auditing, setAuditing] = useState(false)
  const [newPromptModal, setNewPromptModal] = useState(false)
  const [newPromptText, setNewPromptText] = useState("")
  const [selectedPromptDetail, setSelectedPromptDetail] = useState<any>(null)

  // Hydrate from localStorage or fetch new audit
  useEffect(() => {
    try {
      const saved = localStorage.getItem('llm_ai_visibility_audit');
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setLoading(false);
      } else {
        fetchAuditData();
      }
    } catch (e) {
      fetchAuditData();
    }
  }, []);

  // Fetch AI Visibility Data
  const fetchAuditData = async (promptToAdd?: string) => {
    try {
      if (promptToAdd) {
        setAuditing(true);
      } else {
        setLoading(true);
      }

      const res = await fetch('/api/ai-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPrompt: promptToAdd || undefined
        })
      });

      const json = await res.json();
      if (json.success) {
        setData(json);
        try {
          localStorage.setItem('llm_ai_visibility_audit', JSON.stringify(json));
        } catch (err) {
          console.error("Storage error:", err);
        }
      }
    } catch (e) {
      console.error("Failed to load AI Visibility audit:", e);
    } finally {
      setLoading(false);
      setAuditing(false);
    }
  };

  const handleAddNewPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptText.trim()) return;
    fetchAuditData(newPromptText.trim());
    setNewPromptText("");
    setNewPromptModal(false);
  };

  const kpis = data?.kpis || {
    aiVisibility: 0,
    aiShareOfVoice: 0,
    citationShare: 0,
    avgPosition: '-',
    totalPromptsTracked: 0
  };

  const engineList = data?.engineData || [
    { engine: 'ChatGPT (GPT-4o)', visibility: '0%', sov: '0%', mentions: 0, citations: 0, trend: 'Testing...' },
    { engine: 'Google Gemini', visibility: '0%', sov: '0%', mentions: 0, citations: 0, trend: 'Testing...' },
    { engine: 'Claude 3.5', visibility: '0%', sov: '0%', mentions: 0, citations: 0, trend: 'Testing...' },
  ];

  const prompts = data?.promptPerformance || [];

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              AI Visibility <Sparkles className="w-6 h-6 text-brand" />
            </h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-0.5">
              3 AI Engines Connected
            </Badge>
          </div>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm">
            Live multi-engine tracking across <strong>ChatGPT</strong>, <strong>Google Gemini</strong>, and <strong>Claude</strong> for Truefirms brand recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={() => fetchAuditData()}
            disabled={loading || auditing}
            className="gap-2 text-sm bg-white"
          >
            <RefreshCw className={`w-4 h-4 ${auditing || loading ? 'animate-spin text-brand' : 'text-slate-500'}`} />
            {auditing ? 'Auditing AI Models...' : 'Run Live AI Audit'}
          </Button>

          <Button 
            onClick={() => setNewPromptModal(true)} 
            className="gap-2 text-sm bg-brand hover:bg-brand/90"
          >
            <Plus className="w-4 h-4" /> Track New Prompt
          </Button>
        </div>
      </div>

      {/* Active AI Models Indicator */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 px-4 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Bot className="w-4 h-4 text-brand" />
          <span>Live Monitored AI Engines:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>OpenAI (GPT-4o)</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Google Gemini (2.5 Flash)</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Anthropic Claude (3.5)</span>
          </div>
        </div>
      </div>

      {/* Auditing Progress Banner */}
      {(auditing || (loading && !data)) && (
        <div className="bg-brand/5 border border-brand/20 rounded-lg p-4 flex items-center justify-between text-sm text-brand animate-pulse">
          <div className="flex items-center gap-2.5 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-brand" />
            <span>Auditing buyer prompts across ChatGPT (GPT-4o), Google Gemini (2.5), and Claude (3.5)...</span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden md:inline">Real-time LLM evaluation in progress</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              AI Visibility Rate
              <Search className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{kpis.aiVisibility}%</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> Brand suggested in {Math.round(kpis.aiVisibility)}% of prompts
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              AI Share of Voice
              <Percent className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{kpis.aiShareOfVoice}%</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> vs top B2B competitors
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Citation Count
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {prompts.reduce((acc: number, p: any) => acc + (p.citations || 0), 0)}
            </div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> Citations & links found
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Avg Recommendation Rank
              <MessagesSquare className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">#{kpis.avgPosition}</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              Across tracked buyer answers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Visibility Trend by AI Engine</CardTitle>
          <CardDescription>Percentage of monitored prompts where Truefirms is recommended by each engine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultTrendData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} />
                <Line type="monotone" name="ChatGPT" dataKey="chatgpt" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" name="Google Gemini" dataKey="gemini" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" name="Claude" dataKey="claude" stroke="#f97316" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Engine Breakdown */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">AI Engine Breakdown (Live Multi-Model Test)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {engineList.map((engine: any) => (
            <Card key={engine.engine} className="border-slate-200/60 shadow-sm hover:border-brand/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-semibold text-slate-900">{engine.engine}</div>
                    <span className="text-[11px] text-slate-500">Live API Connected</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">
                    {engine.trend}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Visibility Rate</span>
                    <span className="font-semibold text-slate-900">{engine.visibility}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Share of Voice</span>
                    <span className="font-semibold text-slate-900">{engine.sov}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Citations Found</span>
                    <span className="font-semibold text-brand">{engine.citations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Prompt Performance Table */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <CardTitle className="text-lg">Tracked Buyer Prompts</CardTitle>
              <CardDescription>Live evaluation of buyer prompts across ChatGPT, Gemini, and Claude (Click row to see AI answers)</CardDescription>
            </div>
            <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded px-2.5 py-1">
              <strong>{prompts.length}</strong> Prompts Monitored
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/80 border-b uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Tracked Buyer Prompt</th>
                <th className="px-6 py-4 font-medium">Intent</th>
                <th className="px-6 py-4 font-medium text-center">Brand Mentioned</th>
                <th className="px-6 py-4 font-medium text-center">Best Rank</th>
                <th className="px-6 py-4 font-medium">Top Competitor</th>
                <th className="px-6 py-4 font-medium text-center">Citations</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prompts.map((item: any, idx: number) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedPromptDetail(item)}
                  className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 max-w-[320px] truncate" title={item.prompt}>
                    {item.prompt}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <Badge variant="outline" className="font-normal bg-white">
                      {item.intent}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.brandMention === 'Yes' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-900">
                    {item.position !== '-' ? `#${item.position}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="font-medium text-slate-700">{item.competitor}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-brand">
                    {item.citations}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-brand hover:underline font-medium">View AI Answers &rarr;</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Track New Prompt */}
      {newPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand" /> Track New Buyer Prompt
              </h3>
              <button onClick={() => setNewPromptModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter any search or query your target buyers ask AI. We will query <strong>ChatGPT</strong>, <strong>Gemini</strong>, and <strong>Claude</strong> simultaneously.
            </p>
            <form onSubmit={handleAddNewPrompt}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Prompt / Question</label>
                <textarea 
                  rows={3}
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="e.g. Best software agency review sites to hire dedicated developers in 2026"
                  className="w-full text-sm p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setNewPromptModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={auditing}>
                  {auditing ? 'Auditing AI Models...' : 'Audit Across 3 AI Models'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View AI Answers Detail */}
      {selectedPromptDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start mb-3 border-b pb-3">
              <div>
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">Prompt Evaluation</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedPromptDetail.prompt}</h3>
              </div>
              <button onClick={() => setSelectedPromptDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto space-y-4 pr-1 flex-1 py-2">
              {/* ChatGPT */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <strong className="text-sm font-semibold text-slate-900">ChatGPT (GPT-4o)</strong>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white">
                    Mentioned: {selectedPromptDetail.engines?.chatgpt?.mentioned ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-mono bg-white p-3 rounded border border-slate-200/80 whitespace-pre-wrap">
                  {selectedPromptDetail.engines?.chatgpt?.text || selectedPromptDetail.engines?.chatgpt?.snippet || 'No text snippet recorded.'}
                </p>
              </div>

              {/* Gemini */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <strong className="text-sm font-semibold text-slate-900">Google Gemini</strong>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white">
                    Mentioned: {selectedPromptDetail.engines?.gemini?.mentioned ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-mono bg-white p-3 rounded border border-slate-200/80 whitespace-pre-wrap">
                  {selectedPromptDetail.engines?.gemini?.text || selectedPromptDetail.engines?.gemini?.snippet || 'No text snippet recorded.'}
                </p>
              </div>

              {/* Claude */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <strong className="text-sm font-semibold text-slate-900">Claude 3.5</strong>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white">
                    Mentioned: {selectedPromptDetail.engines?.claude?.mentioned ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-mono bg-white p-3 rounded border border-slate-200/80 whitespace-pre-wrap">
                  {selectedPromptDetail.engines?.claude?.text || selectedPromptDetail.engines?.claude?.snippet || 'No text snippet recorded.'}
                </p>
              </div>
            </div>

            <div className="border-t pt-3 mt-2 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedPromptDetail(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
