"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, Download, Share2, Eye, CalendarClock } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    { id: 1, title: "Monthly SEO + AI Visibility Report", period: "Sep 2026", status: "Ready for review", health: 96, generated: "Sep 30, 2026", actions: 12, visibilityChange: "+14.2%" },
    { id: 2, title: "Weekly Tactical Update", period: "Sep 23-29, 2026", status: "Delivered", health: 94, generated: "Sep 29, 2026", actions: 3, visibilityChange: "+2.1%" },
    { id: 3, title: "Executive One-Pager", period: "Q3 2026", status: "Draft", health: 92, generated: "Sep 28, 2026", actions: 8, visibilityChange: "+8.4%" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Automated weekly and monthly deliverables with human-in-the-loop review.
          </p>
        </div>
        <Button>Generate Report</Button>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="audit">Prospect Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map(report => (
              <Card key={report.id} className="flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2.5 bg-brand/10 rounded-lg text-brand">
                      <FileText className="w-5 h-5" />
                    </div>
                    <Badge variant={
                      report.status === 'Ready for review' ? 'warning' :
                      report.status === 'Delivered' ? 'positive' : 'outline'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{report.period}</p>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Data Health</span>
                        <span className="font-semibold text-positive">{report.health}/100</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Generated</span>
                        <span className="font-medium">{report.generated}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Actions Included</span>
                        <span className="font-medium">{report.actions}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Visibility Change</span>
                        <span className="font-medium text-positive">{report.visibilityChange}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="border-t p-4 flex gap-2">
                  <Button variant="default" size="sm" className="flex-1">
                    {report.status === 'Ready for review' ? 'Review' : 'View'}
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
