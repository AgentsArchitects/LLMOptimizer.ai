"use client"
import React, { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"

function IntegrationsContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')

  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleConnected, setIsGoogleConnected] = useState(success === 'google_connected')
  const [gscSites, setGscSites] = useState<string[]>([])
  const [ga4Properties, setGa4Properties] = useState<any[]>([])
  
  const [selectedGsc, setSelectedGsc] = useState("")
  const [selectedGa4, setSelectedGa4] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch sites
        const resSites = await fetch('/api/integrations/google/sites');
        const data = await resSites.json();
        
        let fetchedSites = [];
        let fetchedGa4 = [];

        if (data.connected) {
          setIsGoogleConnected(true);
          fetchedSites = data.sites || [];
          fetchedGa4 = data.ga4Properties || [];
          setGscSites(fetchedSites);
          setGa4Properties(fetchedGa4);
        }

        // Fetch projects to get saved mapping
        const resProj = await fetch('/api/projects');
        const projData = await resProj.json();
        
        const activeProjectId = localStorage.getItem('llm_active_project_id');
        const activeProject = projData.projects?.find((p: any) => p.id === activeProjectId);

        if (activeProject && activeProject.gsc_property) {
          setSelectedGsc(activeProject.gsc_property);
        } else if (fetchedSites.length > 0) {
          setSelectedGsc(fetchedSites[0]);
        }

        if (activeProject && activeProject.ga4_property_id) {
          setSelectedGa4(activeProject.ga4_property_id);
        } else if (fetchedGa4.length > 0) {
          setSelectedGa4(fetchedGa4[0].propertyId);
        }

      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();

    // Listen for project change to update dropdowns dynamically
    const handleProjectChange = () => {
      loadInitialData();
    };
    window.addEventListener('llm_project_changed', handleProjectChange);
    return () => window.removeEventListener('llm_project_changed', handleProjectChange);

  }, [])

  const handleSaveMapping = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/projects/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: localStorage.getItem('llm_active_project_id'),
          gsc_property: selectedGsc,
          ga4_property_id: selectedGa4
        })
      })
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const integrations = [
    { name: "Google Search Console", desc: "Organic search queries and clicks", status: isGoogleConnected ? "Connected" : "Not connected", lastSync: isGoogleConnected ? "Just now" : "-", health: isGoogleConnected ? "Healthy" : "-", type: "seo" },
    { name: "Google Analytics 4", desc: "Traffic, engagement, and conversions", status: isGoogleConnected ? "Connected" : "Not connected", lastSync: isGoogleConnected ? "Just now" : "-", health: isGoogleConnected ? "Healthy" : "-", type: "seo" },
    { name: "OpenAI", desc: "Model routing and AI visibility execution", status: "Connected", lastSync: "10 mins ago", health: "Healthy", type: "ai" },
    { name: "SEMrush", desc: "Rank tracking and competitor visibility", status: "Needs attention", lastSync: "1 day ago", health: "Warning", type: "seo" },
    { name: "DataForSEO", desc: "SERP features and keyword gaps", status: "Not connected", lastSync: "-", health: "-", type: "seo" },
    { name: "Slack", desc: "Alerts for anomalies and reports", status: "Not connected", lastSync: "-", health: "-", type: "alerts" },
  ]

  return (
    <div className="flex flex-col gap-8">
      {success === 'google_connected' && (
        <div className="bg-positive/10 border border-positive/20 text-positive px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-medium">Google Search Console & GA4 successfully connected!</p>
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Failed to connect Google account. Please try again.</p>
        </div>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Project Data Sources</CardTitle>
          <CardDescription>Select which properties to use for your active project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">GSC Property</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm disabled:bg-slate-50"
                value={selectedGsc}
                onChange={e => setSelectedGsc(e.target.value)}
                disabled={isLoading || !isGoogleConnected}
              >
                <option value="">{isLoading ? "Loading..." : "-- Select GSC Property --"}</option>
                {gscSites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">GA4 Property</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm disabled:bg-slate-50"
                value={selectedGa4}
                onChange={e => setSelectedGa4(e.target.value)}
                disabled={isLoading || !isGoogleConnected}
              >
                <option value="">{isLoading ? "Loading..." : "-- Select GA4 Property --"}</option>
                {ga4Properties.map(prop => (
                  <option key={prop.propertyId} value={prop.propertyId}>
                    {prop.accountName} - {prop.propertyName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveMapping} disabled={isSaving || isLoading || !isGoogleConnected} className="bg-brand text-white hover:bg-brand/90">
            {isSaving ? "Saving..." : "Save Data Sources"}
          </Button>
          {saveSuccess && <span className="ml-3 text-sm text-positive flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Saved</span>}
          {!isGoogleConnected && !isLoading && <span className="ml-3 text-sm text-slate-500">Please connect Google below.</span>}
        </CardFooter>
      </Card>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect data sources to feed the LLMOptimizer intelligence engine.
          </p>
        </div>
        <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Sync All</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map(integration => (
          <Card key={integration.name} className="flex flex-col">
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                  ${integration.type === 'seo' ? 'bg-blue-500/10 text-blue-500' : 
                    integration.type === 'ai' ? 'bg-purple-500/10 text-purple-500' : 
                    'bg-slate-500/10 text-slate-500'}`}>
                  {integration.name.charAt(0)}
                </div>
                <Badge variant={
                  integration.status === 'Connected' ? 'positive' :
                  integration.status === 'Needs attention' ? 'warning' : 'outline'
                }>
                  {integration.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription className="text-sm mt-1">{integration.desc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last sync</span>
                  <span className="font-medium">{integration.lastSync}</span>
                </div>
                {integration.status !== 'Not connected' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Data health</span>
                    <span className="font-medium flex items-center gap-1">
                      {integration.health === 'Healthy' ? <CheckCircle2 className="w-4 h-4 text-positive" /> : <AlertCircle className="w-4 h-4 text-warning" />}
                      {integration.health}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 pt-0 mt-auto">
              {integration.status === 'Connected' ? (
                <Button variant="secondary" className="w-full">Configure</Button>
              ) : integration.status === 'Needs attention' ? (
                <Link href={integration.name.includes("Google") ? "/api/integrations/google" : "#"}>
                  <Button variant="default" className="w-full">Reconnect</Button>
                </Link>
              ) : (
                <Link href={integration.name.includes("Google") ? "/api/integrations/google" : "#"}>
                  <Button variant="outline" className="w-full border-dashed">Connect</Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div>Loading integrations...</div>}>
      <IntegrationsContent />
    </Suspense>
  )
}



