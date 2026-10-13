"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Circle, AlertCircle } from "lucide-react"

export default function ActionCenterPage() {
  const actions = [
    { id: 1, title: "Improve comparison-page coverage for high-intent prompts", evidence: "7 of 18 comparison prompts mention competitors but not the brand.", impact: "Organic traffic + AI citation coverage", effort: "M", ice: 8.4, status: "Awaiting approval", owner: "SEO Team" },
    { id: 2, title: "Add Organization schema to primary author pages", evidence: "23 pages contain missing or malformed entity schema.", impact: "Knowledge graph confidence", effort: "S", ice: 7.9, status: "Proposed", owner: "Dev Team" },
    { id: 3, title: "Refresh decaying content on 'Enterprise AI Strategy'", evidence: "Organic traffic down 14% MoM.", impact: "Recapture lost Share of Voice", effort: "L", ice: 6.8, status: "In Progress", owner: "Content Team" },
    { id: 4, title: "Fix broken internal links pointing to /pricing", evidence: "42 internal links return 404.", impact: "Crawl efficiency", effort: "S", ice: 9.1, status: "Measuring", owner: "Dev Team" }
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Action Center</h1>
          <p className="text-muted-foreground mt-1">
            Prioritized recommendations ready for approval and deployment.
          </p>
        </div>
        <Button>Generate Actions</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Actions</TabsTrigger>
          <TabsTrigger value="awaiting">Awaiting Approval (1)</TabsTrigger>
          <TabsTrigger value="progress">In Progress (1)</TabsTrigger>
          <TabsTrigger value="measuring">Measuring (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {actions.map(action => (
              <Card key={action.id} className="flex flex-col hover:border-brand/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <Badge variant={
                      action.status === 'Awaiting approval' ? 'warning' :
                      action.status === 'Proposed' ? 'secondary' :
                      action.status === 'Measuring' ? 'brand' : 'outline'
                    }>
                      {action.status}
                    </Badge>
                    <div className="text-xs font-bold px-2 py-1 bg-brand/10 text-brand rounded-md">
                      ICE {action.ice}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Evidence</span>
                      <p className="text-sm mt-1">{action.evidence}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-muted/50 p-3 rounded-lg">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Expected Impact</span>
                        <p className="text-sm font-medium">{action.impact}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Effort</span>
                        <p className="text-sm font-medium">{action.effort}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="pt-0 border-t mt-4 flex items-center justify-between py-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-foreground mr-2 font-bold">
                      {action.owner.charAt(0)}
                    </span>
                    {action.owner}
                  </div>
                  <div className="flex gap-2">
                    {action.status === 'Awaiting approval' && (
                      <Button size="sm" variant="default" className="bg-positive text-white hover:bg-positive/90">Approve</Button>
                    )}
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
