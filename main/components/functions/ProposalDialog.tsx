import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DepartmentData {
  uid: string;
  designation: string;
  email: string;
}

interface ProposalData {
  name: string;
  description: string;
  concernedDepartments: DepartmentData[];
}

interface ProposalDialogProps {
  token: string | null;
}

const ProposalDialog: React.FC<ProposalDialogProps> = ({ token }) => {
  const [isProposalDialogOpen, setIsProposalDialogOpen] =
    useState<boolean>(false);
  const [proposalData, setProposalData] = useState<ProposalData>({
    name: "",
    description: "",
    concernedDepartments: [
      {
        uid: "",
        designation: "",
        email: "",
      },
    ],
  });

  const addConcernedDepartment = (): void => {
    setProposalData((prev) => ({
      ...prev,
      concernedDepartments: [
        ...prev.concernedDepartments,
        {
          uid: "",
          designation: "",
          email: "",
        },
      ],
    }));
  };

  const removeConcernedDepartment = (index: number): void => {
    setProposalData((prev) => ({
      ...prev,
      concernedDepartments: prev.concernedDepartments.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateConcernedDepartment = (
    index: number,
    field: keyof DepartmentData,
    value: string
  ): void => {
    const updatedDepartments = [...proposalData.concernedDepartments];
    updatedDepartments[index] = {
      ...updatedDepartments[index],
      [field]: value,
    };
    setProposalData((prev) => ({
      ...prev,
      concernedDepartments: updatedDepartments,
    }));
  };

  const handleProposalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setProposalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { toast } = useToast();

  const submitProposal = async (): Promise<any> => {
    try {
      console.log("Submitting proposal:", proposalData);
      const response = await fetch("/api/addProposal", {
        method: "POST",
        headers: {
          Authorization: token as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposalData),
      });

      const result = await response.json();
      console.log("Proposal response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to add proposal");
      }

      // Show success toast
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been successfully added.",
      });

      // Reset form and close dialog
      setProposalData({
        name: "",
        description: "",
        concernedDepartments: [
          {
            uid: "",
            designation: "",
            email: "",
          },
        ],
      });
      setIsProposalDialogOpen(false);
      return result;
      console.log("Proposal response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to add proposal");
      }

      // Reset form and close dialog
      setProposalData({
        name: "",
        description: "",
        concernedDepartments: [
          {
            uid: "",
            designation: "",
            email: "",
          },
        ],
      });
      setIsProposalDialogOpen(false);
      return result;
    } catch (error) {
      console.error("Error adding proposal:", error);
      throw error;
    }
  };

  return (
    <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
  <DialogTrigger asChild>
    <div className="flex justify-center items-center w-full h-full p-4">
      <button className="p-[3px] relative w-64 h-64 group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-[6px] relative transition duration-300 text-white group-hover:bg-opacity-50">
          <Plus className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-2xl font-bold group-hover:scale-105 transition-transform duration-300">Add Proposal</span>
        </div>
      </button>
    </div>
  </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
          <DialogDescription>
            Submit a new proposal with details and concerned departments.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="proposalName" className="text-right">
              Proposal Name
            </Label>
            <Input
              id="proposalName"
              name="name"
              value={proposalData.name}
              onChange={handleProposalInputChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="proposalDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="proposalDescription"
              name="description"
              value={proposalData.description}
              onChange={handleProposalInputChange}
              className="col-span-3"
            />
          </div>

          {proposalData.concernedDepartments.map((dept, index) => (
            <div key={index} className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Department {index + 1}</Label>
                <div className="col-span-3 flex items-center gap-2">
                  {index > 0 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeConcernedDepartment(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">UID</Label>
                <Input
                  value={dept.uid}
                  onChange={(e) =>
                    updateConcernedDepartment(index, "uid", e.target.value)
                  }
                  placeholder="Enter department UID"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Designation</Label>
                <Input
                  value={dept.designation}
                  onChange={(e) =>
                    updateConcernedDepartment(
                      index,
                      "designation",
                      e.target.value
                    )
                  }
                  placeholder="Enter designation"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <Input
                  value={dept.email}
                  onChange={(e) =>
                    updateConcernedDepartment(index, "email", e.target.value)
                  }
                  placeholder="Enter email"
                  className="col-span-3"
                  type="email"
                />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3">
              <Button
                variant="secondary"
                onClick={addConcernedDepartment}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Department
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={submitProposal}
            disabled={!proposalData.name || !proposalData.description}
          >
            Submit Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
