"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AIProjectAnalyzer } from "@/components/functions/ai-analyzer";
import { DiscussionForum } from "@/components/functions/discussion-forum";
import { VotingPoll } from "@/components/functions/voting-poll";
import Navbar from "@/components/functions/NavBar";
import { toast } from "sonner";
import { useAuth } from "../_contexts/authcontext";


// Updated type to match MongoDB structure
interface Proposal {
  _id?: string;
  name: string;
  department_uid: string;
  description: string;
  dept_uids: string[];
  votingStatus: "not-started" | "in-progress" | "completed";
  votes: {
    [key: string]: {
      status: "pending" | "approved" | "rejected";
      timestamp: Date | null;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function PlanningPage() {
  const { token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (!token) {
          toast.error('No authentication token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/getAllProposals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }

        const data = await response.json();

        if (data.success) {
          console.log('Proposals:', data.proposals);
          setProposals(data.proposals);
          // Automatically select the first proposal if available
          if (data.proposals.length > 0) {
            setSelectedProposal(data.proposals[0]);
          }
        } else {
          toast.error(data.message || 'Error fetching proposals');
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
        toast.error('An error occurred while fetching proposals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []); // Empty dependency array means this effect runs once on component mount

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading proposals...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
          Project Planning
        </h1>
        <div className="grid grid-cols-12 gap-6">
          {/* Proposals List */}
          <div className="col-span-12 lg:col-span-3">
            <Card>
              <CardContent className="p-3">
                <h4 className="font-medium mb-2">All Proposals</h4>
                <div className="space-y-2">
                  {proposals.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No proposals available
                    </p>
                  ) : (
                    proposals.map((proposal) => (
                      <button
                        key={proposal._id}
                        onClick={() => setSelectedProposal(proposal)}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          selectedProposal?._id === proposal._id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <h5 className="font-medium">{proposal.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {proposal.department_uid}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <DiscussionForum proposalId={selectedProposal?._id || ""} />
            <AIProjectAnalyzer
              projectDescription={selectedProposal?.description || ""}
            />
          </div>

          {/* Project Details and Voting Section */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {selectedProposal ? (
              <>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">
                      {selectedProposal.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Department: {selectedProposal.department_uid}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Voting Status: {selectedProposal.votingStatus}
                    </p>
                    <h4 className="font-medium mb-2">Description:</h4>
                    <p className="text-sm">{selectedProposal.description}</p>
                  </CardContent>
                </Card>
                <VotingPoll proposalId={selectedProposal._id || ""} />
              </>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-muted-foreground">
                    Select a proposal to view details and voting options
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}