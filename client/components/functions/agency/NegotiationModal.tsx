import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NegotiationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (negotiationDetails: { proposedAmount: number; reason: string }) => void
  tenderName: string
  estimatedCost: number
}

export function NegotiationModal({ isOpen, onClose, onSubmit, tenderName, estimatedCost }: NegotiationModalProps) {
  const [proposedAmount, setProposedAmount] = useState<number>(estimatedCost)
  const [reason, setReason] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ proposedAmount, reason })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Negotiate Payment for {tenderName}</DialogTitle>
          <DialogDescription>
            Enter your proposed amount and reason for negotiation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proposedAmount" className="text-right">
                Proposed Amount
              </Label>
              <Input
                id="proposedAmount"
                type="number"
                value={proposedAmount}
                onChange={(e) => setProposedAmount(Number(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

