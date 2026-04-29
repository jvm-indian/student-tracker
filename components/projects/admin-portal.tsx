'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Users, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

interface PortalProps {
  user: User
  profile: any
}

export function AdminPortal({ user, profile }: PortalProps) {
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch teams with their members, guides, and submissions
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*, profiles!teams_guide_id_fkey(full_name, email), team_members(*, profiles(full_name, email)), project_submissions(*)')
        .order('created_at', { ascending: false })
      
      if (teamsError) throw teamsError
      setTeams(teamsData || [])

      // Fetch all guides/teachers/students (anyone who can be assigned as a guide)
      const { data: guidesData, error: guidesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
      
      if (guidesError) throw guidesError
      setGuides(guidesData || [])

    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAllocateGuide = async (teamId: string, guideId: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ guide_id: guideId, status: 'active' })
        .eq('id', teamId)
      if (error) throw error
      toast.success('Guide allocated successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleApproveMarks = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ coordinator_approval: true, status: 'approved' })
        .eq('id', submissionId)
      if (error) throw error
      toast.success('Marks approved successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-primary"/> Administrator Portal</CardTitle>
          <CardDescription>Allocate guides to teams and approve project marks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {teams.map(team => {
              const submission = team.project_submissions?.[0]
              return (
                <Card key={team.id} className="bg-muted/20 border-border">
                  <CardHeader className="pb-2 border-b border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{team.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">Status: {team.status.replace('_', ' ')}</CardDescription>
                      </div>
                      <Users className="w-4 h-4 text-muted-foreground"/>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Guide Allocation */}
                    <div className="space-y-2">
                      <Label className="text-xs">Assigned Guide</Label>
                      {team.guide_id ? (
                        <div className="p-2 bg-muted rounded-md text-sm">
                          {team.profiles?.full_name || team.profiles?.email}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Select onValueChange={(val) => handleAllocateGuide(team.id, val)}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Select a guide" />
                            </SelectTrigger>
                            <SelectContent>
                              {guides.map(g => (
                                <SelectItem key={g.id} value={g.id}>
                                  {g.full_name || g.email} <span className="text-muted-foreground ml-1">({g.role})</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Marks Approval */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <Label className="text-xs flex items-center gap-1"><FileText className="w-3 h-3"/> Evaluation</Label>
                      {submission ? (
                        <div className="flex items-center justify-between p-3 border rounded-md border-border bg-card">
                          <div>
                            <p className="text-sm font-medium">Marks: {submission.marks}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {submission.coordinator_approval ? 'Approved' : 'Pending Approval'}
                            </p>
                          </div>
                          {!submission.coordinator_approval && submission.marks > 0 && (
                            <Button size="sm" onClick={() => handleApproveMarks(submission.id)} className="gap-1">
                              <CheckCircle2 className="w-4 h-4"/> Approve
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No submission or marks yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {teams.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No project teams found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
