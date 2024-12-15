'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Vote } from '@/types/planning'
import { useAuth } from '@/app/_contexts/authcontext'

export function VotingPoll({ proposalId }: { proposalId: string }) {
  const { token } = useAuth()
  const [votes, setVotes] = useState<Vote[]>([])
  const [userVote, setUserVote] = useState<boolean | null>(null)

  useEffect(() => {
    fetchVotes()
  }, [proposalId])

  const fetchVotes = async () => {
    const response = await fetch(`/api/getVote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token as string,
      },
      body: JSON.stringify({ proposalId }),
    })
    const data = await response.json()
    console.log('Votes:', data)
    setVotes(data)
  }

  const castVote = async (vote: boolean) => {
    console.log('Casting vote:', vote)
    console.log('Proposal ID:', proposalId)
    try {
      const response = await fetch('/api/castVote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token as string,
        },
        body: JSON.stringify({ proposalId, vote }),
      })
    const result = await response.json()
    console.log('Vote response:', result)
    if (response.ok) {
      setUserVote(vote)
      fetchVotes()
    }
  } catch (error) {
    console.error('Failed to cast vote:', error)
  }
}

const totalVotes = votes.length
const yesVotes = votes.filter(v => v.vote).length
const yesPercentage = totalVotes ? (yesVotes / totalVotes) * 100 : 0
const isApproved = yesPercentage >= 51

return (
  <Card>
    <CardHeader>
      <CardTitle>Poll / Voting Results</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {userVote === null ? (
          <div className="space-y-2">
            <Button onClick={() => castVote(true)} className="w-full">Vote Yes</Button>
            <Button onClick={() => castVote(false)} variant="outline" className="w-full">Vote No</Button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">You voted: {userVote ? 'Yes' : 'No'}</p>
        )}
        <div className="space-y-2">
          <Progress value={yesPercentage} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{yesPercentage.toFixed(1)}% Yes</span>
            <span>{totalVotes} votes</span>
          </div>
        </div>
        {totalVotes > 0 && (
          <div className={`text-center font-medium ${isApproved ? 'text-green-500' : 'text-yellow-500'}`}>
            {isApproved ? 'Proposal Approved' : 'Awaiting More Votes'}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)
}

