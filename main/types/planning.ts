export interface Proposal {
    id: string
    title: string
    description: string
    department: string
    createdAt: Date
    status: 'pending' | 'approved' | 'rejected'
  }
  
  export interface Message {
    id: string
    proposalId: string
    userId: string
    content: string
    timestamp: Date
    body: string
  }
  
  export interface Vote {
    proposalId: string
    userId: string
    vote: boolean
  }
  
  export interface AIAnalysis {
    conflicts: string[]
    recommendations: string[]
    riskLevel: 'low' | 'medium' | 'high'
  }
  
  