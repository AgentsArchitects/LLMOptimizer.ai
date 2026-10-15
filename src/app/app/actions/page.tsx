"use client"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  CheckSquare, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users as UsersIcon, 
  Plus, 
  RefreshCw, 
  Layers, 
  Target, 
  Search, 
  ExternalLink,
  X
} from "lucide-react"

interface ActionItem {
  id: string;
  title: string;
  category: 'AEO & Citations' | 'SEO Optimization' | 'Conversion (GA4)' | 'Technical & Schema';
  evidence: string;
  impact: string;
  confidence: 'High' | 'Medium' | 'Low';
  effort: 'S' | 'M' | 'L';
  ice: number;
  owner: string;
  status: 'Awaiting approval' | 'In Progress' | 'Completed';
  source: 'AI Engines' | 'GSC' | 'GA4' | 'Unified Engine';
}

const DEFAULT_ACTIONS: ActionItem[] = [
  {
    id: "act-1",
    title: "Optimize Title & Meta tags for '/company-search/Staff-Augmentation'",
    category: "SEO Optimization",
    evidence: "7,965 search impressions in GSC but only 0.04% CTR. Page is ranking on position #38.",
    impact: "+450-800 organic monthly clicks",
    confidence: "High",
    effort: "S",
    ice: 8.9,
    owner: "SEO Team",
    status: "Awaiting approval",
    source: "GSC"
  },
  {
    id: "act-2",
    title: "Build 'Truefirms vs Clutch' authoritative comparison page",
    category: "AEO & Citations",
    evidence: "ChatGPT & Claude recommend Clutch on 4 out of 5 buyer comparison prompts without citing Truefirms.",
    impact: "+24% AI Share of Voice & Perplexity citations",
    confidence: "High",
    effort: "M",
    ice: 8.5,
    owner: "Content Team",
    status: "Awaiting approval",
    source: "AI Engines"
  },
  {
    id: "act-3",
    title: "Add Lead-Capture CTA banner on high-traffic landing page '/jobs'",
    category: "Conversion (GA4)",
    evidence: "GA4 recorded 1,343 visits & 8.5k events on this URL, but lead inquiries remain under 1.2%.",
    impact: "+18% Key Events & Consultation bookings",
    confidence: "High",
    effort: "S",
    ice: 8.2,
    owner: "Dev Team",
    status: "In Progress",
    source: "GA4"
  },
  {
    id: "act-4",
    title: "Deploy Organization & AggregatedRating Schema on B2B review pages",
    category: "Technical & Schema",
    evidence: "AI crawlers like PerplexityBot and GPTBot require structured entity schema to extract trust signals.",
    impact: "Enhanced rich snippets & LLM entity knowledge",
    confidence: "Medium",
    effort: "M",
    ice: 7.8,
    owner: "Dev Team",
    status: "In Progress",
    source: "Unified Engine"
  },
  {
    id: "act-5",
    title: "Refresh decaying content on 'Benefits of Staff Augmentation 2026'",
    category: "AEO & Citations",
    evidence: "Organic traffic dropped 14% MoM; competitor Toptal gained the top citation slot in Gemini.",
    impact: "Recapture lost Share of Voice from Toptal",
    confidence: "Medium",
    effort: "L",
    ice: 7.2,
    owner: "Content Team",
    status: "Completed",
    source: "AI Engines"
  }
];

export default function ActionsCenterPage() {
  const [actions, setActions] = useState<ActionItem[]>(DEFAULT_ACTIONS);
  const [activeTab, setActiveTab] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for new action
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ActionItem['category']>("SEO Optimization");
  const [newEvidence, setNewEvidence] = useState("");
  const [newImpact, setNewImpact] = useState("");
  const [newEffort, setNewEffort] = useState<'S' | 'M' | 'L'>("S");

  // Load saved actions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('llm_project_actions');
      if (saved) {
        setActions(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load actions from storage", e);
    }
  }, []);

  // Save actions to localStorage
  const saveActions = (newActions: ActionItem[]) => {
    setActions(newActions);
    try {
      localStorage.setItem('llm_project_actions', JSON.stringify(newActions));
    } catch (e) {
      console.error("Failed to save actions", e);
    }
  };

  // Status changers
  const updateStatus = (id: string, newStatus: ActionItem['status']) => {
    const updated = actions.map(act => act.id === id ? { ...act, status: newStatus } : act);
    saveActions(updated);
  };

  // Re-generate fresh actions
  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  // Add new custom action
  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAction: ActionItem = {
      id: `act-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      evidence: newEvidence.trim() || "Manual recommendation added by marketing manager.",
      impact: newImpact.trim() || "Positive growth in search & AI citation rankings",
      confidence: "High",
      effort: newEffort,
      ice: 8.0,
      owner: "SEO Team",
      status: "Awaiting approval",
      source: "Unified Engine"
    };

    saveActions([newAction, ...actions]);
    setNewTitle("");
    setNewEvidence("");
    setNewImpact("");
    setIsAddModalOpen(false);
  };

  // Filter actions based on active tab
  const filteredActions = actions.filter(act => {
    if (activeTab === "all") return true;
    if (activeTab === "awaiting") return act.status === "Awaiting approval";
    if (activeTab === "progress") return act.status === "In Progress";
    if (activeTab === "completed") return act.status === "Completed";
    return true;
  });

  const awaitingCount = actions.filter(a => a.status === "Awaiting approval").length;
  const inProgressCount = actions.filter(a => a.status === "In Progress").length;
  const completedCount = actions.filter(a => a.status === "Completed").length;

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Action Center <CheckSquare className="w-6 h-6 text-brand" />
            </h1>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs py-0.5">
              GSC + GA4 + LLM Powered
            </Badge>
          </div>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm">
            Prioritized strategic tasks to increase organic search clicks, GA4 conversions, and AI engine recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="gap-2 text-sm bg-white"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-brand' : 'text-slate-500'}`} />
            {isGenerating ? 'Scanning Data...' : 'Scan & Update Actions'}
          </Button>

          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 text-sm bg-brand hover:bg-brand/90"
          >
            <Plus className="w-4 h-4" /> Add Custom Action
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Awaiting Approval
              <Clock className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{awaitingCount}</div>
            <p className="text-xs text-slate-400 mt-1">High-priority items ready to review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              In Progress
              <Layers className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-slate-400 mt-1">Currently being executed by team</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Completed Actions
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{completedCount}</div>
            <p className="text-xs text-slate-400 mt-1">Successfully deployed & tracking</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Avg Priority (ICE)
              <Target className="w-4 h-4 text-brand" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand">
              {(actions.reduce((acc, a) => acc + a.ice, 0) / (actions.length || 1)).toFixed(1)}/10
            </div>
            <p className="text-xs text-slate-400 mt-1">Impact × Confidence × Ease</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter & Action Cards */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="all" className="text-xs">
                All Actions ({actions.length})
              </TabsTrigger>
              <TabsTrigger value="awaiting" className="text-xs">
                Awaiting Approval ({awaitingCount})
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-xs">
                In Progress ({inProgressCount})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">
                Completed ({completedCount})
              </TabsTrigger>
            </TabsList>
            
            <span className="text-xs text-slate-400 hidden md:inline">
              Sorted by highest ICE score (Impact first)
            </span>
          </div>

          <TabsContent value={activeTab} className="mt-0 space-y-4">
            {filteredActions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200/80 p-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800">No actions in this tab</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  All tasks in this section have been resolved or moved to another stage.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredActions.map(action => (
                  <Card key={action.id} className="flex flex-col border-slate-200/80 shadow-sm hover:border-brand/40 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-2 py-0.5 font-medium ${
                              action.status === 'Awaiting approval' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              action.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {action.status}
                          </Badge>

                          <Badge variant="secondary" className="text-[11px] font-normal">
                            {action.category}
                          </Badge>
                        </div>

                        <div className="text-xs font-bold px-2 py-0.5 bg-brand/10 text-brand rounded-md flex-shrink-0">
                          ICE {action.ice}
                        </div>
                      </div>

                      <CardTitle className="text-base font-semibold text-slate-900 leading-snug">
                        {action.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-4 flex-1">
                      <div className="space-y-3 text-xs">
                        {/* Evidence */}
                        <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100">
                          <span className="font-semibold text-slate-600 block mb-0.5 uppercase text-[10px] tracking-wider">
                            Data Evidence ({action.source})
                          </span>
                          <p className="text-slate-700 leading-relaxed">{action.evidence}</p>
                        </div>

                        {/* Impact & Effort */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Expected Impact</span>
                            <span className="font-semibold text-emerald-700 block truncate">{action.impact}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Effort Level</span>
                            <span className="font-medium text-slate-700">
                              {action.effort === 'S' ? 'Quick Win (Small)' : action.effort === 'M' ? 'Medium (1-2 days)' : 'High (Sprint)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 border-t flex items-center justify-between bg-slate-50/40 p-3 px-5 text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                        {action.owner}
                      </span>

                      {/* Interactive Status Switcher Buttons */}
                      <div className="flex items-center gap-1.5">
                        {action.status === 'Awaiting approval' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateStatus(action.id, 'In Progress')}
                            className="h-7 text-xs bg-brand hover:bg-brand/90"
                          >
                            Approve Action
                          </Button>
                        )}

                        {action.status === 'In Progress' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateStatus(action.id, 'Completed')}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Mark Deployed
                          </Button>
                        )}

                        {action.status === 'Completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateStatus(action.id, 'In Progress')}
                            className="h-7 text-xs text-slate-600"
                          >
                            Reopen
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal: Add Custom Action */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand" /> Add Strategic Action
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action Title</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rewrite meta description for /about-us"
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="AEO & Citations">AEO & Citations</option>
                    <option value="Conversion (GA4)">Conversion (GA4)</option>
                    <option value="Technical & Schema">Technical & Schema</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Effort</label>
                  <select 
                    value={newEffort}
                    onChange={(e: any) => setNewEffort(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="S">Small (Quick win)</option>
                    <option value="M">Medium (1-2 days)</option>
                    <option value="L">Large (Sprint)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Evidence / Problem</label>
                <textarea 
                  rows={2}
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="e.g. 2,500 impressions with only 0.2% CTR"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Impact</label>
                <input 
                  type="text"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  placeholder="e.g. +200 organic clicks per month"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-brand hover:bg-brand/90">Add to Action Center</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
