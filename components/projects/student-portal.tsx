'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Users, FileText, Award, Upload } from 'lucide-react'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

interface PortalProps {
  user: User
  profile: any
}

export function StudentPortal({ user, profile }: PortalProps) {
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [submission, setSubmission] = useState<any>(null)
  const [guide, setGuide] = useState<any>(null)
  const [teamName, setTeamName] = useState('')
  const [reportUrl, setReportUrl] = useState('')
  const [certUrl, setCertUrl] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      // Get the team the user is part of
      const { data: memberData } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('student_id', user.id)
        .single()

      if (memberData) {
        const { data: teamData } = await supabase
          .from('teams')
          .select('*')
          .eq('id', memberData.team_id)
          .single()
        
        setTeam(teamData)

        if (teamData?.guide_id) {
          const { data: guideData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', teamData.guide_id)
            .single()
          setGuide(guideData)
        }

        const { data: membersData } = await supabase
          .from('team_members')
          .select('*, profiles(full_name, email)')
          .eq('team_id', memberData.team_id)
        setMembers(membersData || [])

        const { data: subData } = await supabase
          .from('project_submissions')
          .select('*')
          .eq('team_id', memberData.team_id)
          .single()
        setSubmission(subData)
      }
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return
    try {
      const { data: newTeam, error: teamError } = await supabase
        .from('teams')
        .insert({ name: teamName, created_by: user.id })
        .select()
        .single()
      
      if (teamError) throw teamError

      const { error: memberError } = await supabase
        .from('team_members')
        .insert({ team_id: newTeam.id, student_id: user.id, status: 'accepted' })
      
      if (memberError) throw memberError

      toast.success('Team created successfully!')
      fetchTeamData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSubmitFiles = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!team) return
    try {
      if (submission) {
        const { error } = await supabase
          .from('project_submissions')
          .update({ report_url: reportUrl, certificate_url: certUrl })
          .eq('id', submission.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('project_submissions')
          .insert({ team_id: team.id, report_url: reportUrl, certificate_url: certUrl })
        if (error) throw error
      }
      toast.success('Files submitted successfully!')
      fetchTeamData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  if (!team) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create a Project Team</CardTitle>
          <CardDescription>Start by creating a team for your capstone project</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input 
                id="teamName" 
                value={teamName} 
                onChange={e => setTeamName(e.target.value)} 
                placeholder="e.g. AI Visionaries" 
                required 
              />
            </div>
            <Button type="submit">Create Team</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/> Team: {team.name}</CardTitle>
          <CardDescription>
            Status: <span className="font-semibold text-primary">{team.status.replace('_', ' ').toUpperCase()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Members</h4>
            <ul className="space-y-2">
              {members.map(m => (
                <li key={m.id} className="text-sm p-2 bg-muted rounded-md flex justify-between items-center">
                  <span>{m.profiles?.full_name || m.profiles?.email}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{m.status}</span>
                </li>
              ))}
            </ul>
          </div>
          {guide ? (
            <div className="p-3 border rounded-md border-border bg-card">
              <p className="text-sm text-muted-foreground">Assigned Guide</p>
              <p className="font-medium">{guide.full_name || guide.email}</p>
            </div>
          ) : (
            <div className="p-3 border border-dashed rounded-md border-border text-center text-sm text-muted-foreground">
              Waiting for admin to allocate a guide
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Submissions & Marks</CardTitle>
          <CardDescription>Upload your final report and view your evaluation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmitFiles} className="space-y-4">
            <div className="space-y-2">
              <Label>Report Document URL</Label>
              <Input 
                value={reportUrl} 
                onChange={e => setReportUrl(e.target.value)} 
                placeholder="Link to PDF/Doc" 
                defaultValue={submission?.report_url}
              />
            </div>
            <div className="space-y-2">
              <Label>Certificate Image/PDF URL</Label>
              <Input 
                value={certUrl} 
                onChange={e => setCertUrl(e.target.value)} 
                placeholder="Link to Certificate" 
                defaultValue={submission?.certificate_url}
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Upload className="w-4 h-4"/>
              {submission ? 'Update Submissions' : 'Submit Files'}
            </Button>
          </form>

          {submission && (
            <div className="pt-4 border-t border-border space-y-3">
              <h4 className="font-medium flex items-center gap-2"><Award className="w-4 h-4 text-primary"/> Evaluation Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Guide Marks</p>
                  <p className="text-2xl font-bold">{submission.marks || '-'}</p>
                </div>
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Coordinator Approval</p>
                  <p className={`text-sm font-medium mt-1 ${submission.coordinator_approval ? 'text-green-500' : 'text-yellow-500'}`}>
                    {submission.coordinator_approval ? 'Approved' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
