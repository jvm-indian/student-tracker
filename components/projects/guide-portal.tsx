'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Users, CheckCircle, FileText, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

interface PortalProps {
  user: User
  profile: any
}

export function GuidePortal({ user, profile }: PortalProps) {
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchAssignedTeams()
  }, [])

  const fetchAssignedTeams = async () => {
    try {
      setLoading(true)
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*, team_members(*, profiles(full_name, email)), project_submissions(*)')
        .eq('guide_id', user.id)
      
      if (error) throw error
      setTeams(teamsData || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMarks = async (submissionId: string | undefined, teamId: string, marks: number) => {
    try {
      if (submissionId) {
        const { error } = await supabase
          .from('project_submissions')
          .update({ marks, status: 'graded' })
          .eq('id', submissionId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('project_submissions')
          .insert({ team_id: teamId, marks, status: 'graded' })
        if (error) throw error
      }
      toast.success('Marks updated successfully!')
      fetchAssignedTeams()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guide Marks Portal</CardTitle>
          <CardDescription>Evaluate reports and assign marks to your allocated project teams</CardDescription>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No teams assigned to you yet</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {teams.map(team => {
                const submission = team.project_submissions?.[0]
                return (
                  <Card key={team.id} className="bg-muted/30 border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>Status: {team.status.replace('_', ' ')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Team Members:</p>
                        <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                          {team.team_members?.map((m: any) => (
                            <li key={m.id} className="flex justify-between items-center bg-card p-2 rounded-md border border-border">
                              <span>{m.profiles?.full_name || m.profiles?.email}</span>
                              <Button size="sm" variant="ghost" className="h-6 px-2 gap-1" asChild>
                                <a href={`/messages?chatWith=${m.student_id}`}>
                                  <MessageSquare className="w-3 h-3" /> Message
                                </a>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-border space-y-3">
                        <p className="text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4"/> Submissions</p>
                        {submission ? (
                          <div className="space-y-2 text-sm">
                            {submission.report_url ? (
                              <a href={submission.report_url} target="_blank" rel="noreferrer" className="text-primary hover:underline block">View Report Document</a>
                            ) : <span className="text-muted-foreground block">No report submitted</span>}
                            
                            {submission.certificate_url ? (
                              <a href={submission.certificate_url} target="_blank" rel="noreferrer" className="text-primary hover:underline block">View Certificate</a>
                            ) : <span className="text-muted-foreground block">No certificate submitted</span>}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No submissions yet.</p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Label>Evaluate (Marks)</Label>
                        <div className="flex gap-2 mt-2">
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            defaultValue={submission?.marks || ''} 
                            placeholder="Enter marks"
                            id={`marks-${team.id}`}
                          />
                          <Button 
                            onClick={() => {
                              const val = (document.getElementById(`marks-${team.id}`) as HTMLInputElement).value
                              handleUpdateMarks(submission?.id, team.id, parseInt(val || '0'))
                            }}
                            className="shrink-0"
                          >
                            <CheckCircle className="w-4 h-4 mr-2"/> Save
                          </Button>
                        </div>
                        {submission?.coordinator_approval && (
                          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3"/> Approved by Admin
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
