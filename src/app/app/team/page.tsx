"use client"
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  MoreVertical, 
  CheckCircle2, 
  Sparkles, 
  X,
  Lock,
  Globe
} from "lucide-react"

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'SEO Specialist' | 'Content Strategist' | 'Client (Viewer)';
  projects: string;
  status: 'Active' | 'Invited';
}

const DEFAULT_MEMBERS: Member[] = [
  {
    id: "m-1",
    name: "Admin User",
    email: "admin@truefirms.co",
    role: "Owner",
    projects: "All Projects",
    status: "Active"
  },
  {
    id: "m-2",
    name: "SEO Analyst",
    email: "seo@truefirms.co",
    role: "SEO Specialist",
    projects: "TRUE FIRMS BRAND NAME",
    status: "Active"
  },
  {
    id: "m-3",
    name: "Growth Agency Partner",
    email: "agency@partner.com",
    role: "Client (Viewer)",
    projects: "TRUE FIRMS BRAND NAME",
    status: "Active"
  }
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<'Owner' | 'SEO Specialist' | 'Content Strategist' | 'Client (Viewer)'>('SEO Specialist')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: name.trim() || email.split("@")[0],
      email: email.trim(),
      role,
      projects: "TRUE FIRMS BRAND NAME",
      status: "Invited"
    }

    setMembers([...members, newMember])
    setIsInviteOpen(false)
    setEmail("")
    setName("")
    setToastMessage(`Invitation sent to ${newMember.email}!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-border text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Team & Clients</h1>
            <Badge variant="brand" className="text-[11px] font-medium">
              Multi-Seat Workspace
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage agency team members, permissions, and read-only client deliverable access.
          </p>
        </div>

        <Button 
          onClick={() => setIsInviteOpen(true)}
          className="gap-2 bg-brand hover:bg-brand/90 text-white"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member / Client
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Seats</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">{members.length} / 10</span>
            <Badge variant="outline" className="text-[10px]">Growth Plan</Badge>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agency Admins</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-brand">2</span>
            <span className="text-xs text-muted-foreground">Full Control</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client Viewers</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">1</span>
            <span className="text-xs text-positive font-medium">Read-Only</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Security Policy</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-sm font-bold text-foreground">2FA Enabled</span>
            <Badge variant="positive" className="text-[10px]">Compliant</Badge>
          </div>
        </Card>
      </div>

      {/* Members Table */}
      <Card className="border border-border overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base">Workspace Members ({members.length})</CardTitle>
          <CardDescription className="text-xs">
            Collaborators with access to project dashboards, reports, and action queues.
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Assigned Project</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs uppercase">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{m.name}</div>
                        <div className="text-muted-foreground text-[11px]">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant={m.role === 'Owner' ? 'brand' : m.role === 'Client (Viewer)' ? 'secondary' : 'outline'}>
                      {m.role}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground font-medium">{m.projects}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 font-semibold ${m.status === 'Active' ? 'text-positive' : 'text-warning'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${m.status === 'Active' ? 'bg-positive' : 'bg-warning'}`}></span>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* INVITE MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand/10 text-brand rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Invite to Workspace</h3>
                  <p className="text-xs text-muted-foreground">Collaborate on SEO, AEO, and client reports</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsInviteOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Workspace Role
                </label>
                <select 
                  value={role} 
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="SEO Specialist">SEO Specialist (Full access to tools)</option>
                  <option value="Content Strategist">Content Strategist (AEO + Content focus)</option>
                  <option value="Client (Viewer)">Client / Stakeholder (Read-only reports)</option>
                  <option value="Owner">Workspace Admin (Billing & settings)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-brand hover:bg-brand/90 text-white"
                >
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
