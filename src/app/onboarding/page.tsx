"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Globe, Link as LinkIcon, CheckCircle2, ChevronRight, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase" 

export default function OnboardingPage() {
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [workspaceName, setWorkspaceName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  
  // Created Entities
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  const handleCreateWorkspace = async () => {
    if (!workspaceName) return
    setLoading(true)
    
    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // 2. Create Workspace
      const { data: workspace, error: wsError } = await supabase
        .from('workspaces')
        .insert({ name: workspaceName })
        .select()
        .single()
        
      if (wsError) throw wsError

      // 3. Add as Owner (RLS might do this automatically, or we insert)
      await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'owner'
        })

      setWorkspaceId(workspace.id)
      setStep(2)
    } catch (e: any) {
      console.error("Workspace Error:", e)
      alert("Error creating workspace: " + (e.message || JSON.stringify(e)))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!projectName || !workspaceId) return
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          workspace_id: workspaceId,
          name: projectName,
          url: projectUrl
        })
        
      if (error) throw error

      setStep(3)
    } catch (e: any) {
      console.error("Project Error:", e)
      alert("Error creating project: " + (e.message || JSON.stringify(e)))
    } finally {
      setLoading(false)
    }
  }

  const handleConnectGoogle = () => {
    // Redirect to the existing google integrations route
    // We should pass workspaceId or projectId eventually, but for now just use the existing flow
    window.location.href = '/api/integrations/google'
  }

  const finishOnboarding = () => {
    router.push("/app")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= num ? 'bg-brand text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-16 h-1 rounded-full mx-2 transition-colors ${
                  step > num ? 'bg-brand' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Workspace */}
        {step === 1 && (
          <Card className="border-slate-200 shadow-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Create your Workspace</CardTitle>
              <CardDescription className="text-base mt-2">
                A workspace is where your team collaborates. It can contain multiple projects or clients.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input 
                  id="workspace-name" 
                  placeholder="e.g. Acme Agency or My Company" 
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="h-12"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateWorkspace} 
                disabled={!workspaceName || loading} 
                className="w-full h-12 text-lg bg-brand hover:bg-brand/90 text-white"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'} 
                {!loading && <ChevronRight className="w-5 h-5 ml-2" />}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Project */}
        {step === 2 && (
          <Card className="border-slate-200 shadow-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Add your first Project</CardTitle>
              <CardDescription className="text-base mt-2">
                Let's set up the first brand or website you want to track.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project / Brand Name</Label>
                <Input 
                  id="project-name" 
                  placeholder="e.g. TrueFirms" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-url">Website URL (Optional)</Label>
                <Input 
                  id="project-url" 
                  placeholder="https://truefirms.co" 
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  className="h-12"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateProject} 
                disabled={!projectName || loading} 
                className="w-full h-12 text-lg bg-brand hover:bg-brand/90 text-white"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Project'} 
                {!loading && <ChevronRight className="w-5 h-5 ml-2" />}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Integrations */}
        {step === 3 && (
          <Card className="border-slate-200 shadow-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Connect Data Sources</CardTitle>
              <CardDescription className="text-base mt-2">
                Connect Google Search Console to pull in your organic performance data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center p-1">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-full h-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Google Search Console</h3>
                    <p className="text-sm text-slate-500">Track clicks, impressions & ranking</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleConnectGoogle}>
                  Connect
                </Button>
              </div>
              
              <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFB300] text-white rounded flex items-center justify-center p-1 font-bold text-xs">
                    GA4
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Google Analytics 4</h3>
                    <p className="text-sm text-slate-500">Track sessions & conversions</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button 
                onClick={finishOnboarding} 
                className="w-full h-12 text-lg bg-brand hover:bg-brand/90 text-white"
              >
                Go to Dashboard
              </Button>
              <button onClick={finishOnboarding} className="text-sm text-slate-500 hover:text-slate-700">
                I'll do this later
              </button>
            </CardFooter>
          </Card>
        )}

      </div>
    </div>
  )
}
