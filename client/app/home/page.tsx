"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import dynamic from "next/dynamic";
import Navbar from "@/components/functions/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "../_contexts/authcontext";
import { LinkPreview } from "@/components/ui/link-preview";
// import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import ProposalDialog from "@/components/functions/ProposalDialog";
// import LeafletMap from '@/components/functions/MapFunc'
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
import { X, Plus } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import TenderDialog from "@/components/functions/TenderDialog";
import { MapComponent } from "@/components/functions/map2";

// Interfaces
interface Project {
  id: number;
  name: string;
  status: string;
  timeline: string;
}

interface Resource {
  name: string;
  amount: number;
  unit: string;
}

interface ProjectLocation {
  id: number;
  position: [number, number];
  name: string;
}

interface ReportData {
  projectName: string;
  location: string;
  timeTaken: string;
  resourcesUsed: string;
  cost: string;
  otherDetails: string;
}

interface ChartDataset {
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home(): JSX.Element {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const mapInitializedRef = useRef(false);
  const [reportHeight, setReportHeight] = useState(256); // 256px is equivalent to h-64
  const resizeRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [proposalData, setProposalData] = useState({
    name: "",
    description: "",
    concernedDepartments: [{
      uid: "",
      designation: "",
      email: ""
    }]
  });

  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

  const [resources] = useState<Resource[]>([
    { name: "Resource A", amount: 100, unit: "Units" },
    { name: "Resource B", amount: 200, unit: "Units" },
    { name: "Resource C", amount: 150, unit: "Units" },
    { name: "Resource D", amount: 80, unit: "Units" },
    { name: "Resource E", amount: 120, unit: "Units" },
    { name: "Resource F", amount: 300, unit: "Units" },
    { name: "Resource G", amount: 90, unit: "Units" },
    { name: "Resource H", amount: 60, unit: "Units" },
    { name: "Resource I", amount: 75, unit: "Units" },
    { name: "Resource J", amount: 200, unit: "Units" },
  ]);

  const [reportData, setReportData] = useState<ReportData>({
    projectName: "",
    location: "",
    timeTaken: "",
    resourcesUsed: "",
    cost: "",
    otherDetails: "",
  });

  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [department, setDepartment] = useState<string>("");

  useEffect(() => {
    if (!mapInitializedRef.current) {
      setIsClient(true);
      mapInitializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const fetchDepartments = async (): Promise<void> => {
      try {
        const response = await fetch("/api/getName", {
          headers: {
            Authorization: token as string,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDepartment(data.department);
        } else {
          console.error("Failed to fetch department name");
        }
      } catch (error) {
        console.error("Failed to fetch department name", error);
      }
    };
    if (token) {
      fetchDepartments();
    }
  }, [token]);

  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      try {
        const response = await fetch("/api/myProject", {
          method: "POST",
          headers: {
            Authorization: token as string,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const chartData: ChartData = {
    labels: ["Completed", "In Progress", "Upcoming"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        borderColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  const mapCenter: [number, number] = [22.5744, 88.3629];
  const projectLocations: ProjectLocation[] = [
    { id: 1, position: [22.5744, 88.3629], name: "Project A" },
    { id: 2, position: [51.51, -0.1], name: "Project B" },
    { id: 3, position: [51.49, -0.08], name: "Project C" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateReport = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      const report = `
        generate me a government project report based on the following details:
        Department: ${department}
        Project Name: ${reportData.projectName}
        Location: ${reportData.location}
        Time Taken: ${reportData.timeTaken}
        Resources Used: ${reportData.resourcesUsed}
        Cost: ${reportData.cost}
        Other Details: ${reportData.otherDetails}

        You can take this as an example and modify it as per your requirements:
                  ---
          **Detailed Project Report: Water Pipeline Installation**

          ---

          #### Department:
          Water Department

          #### Project Name:
          Water Pipeline Installation

          #### Location:
          Ward 40, Kolkata

          #### Project Overview:
          The Water Pipeline Installation project in Ward 40, Kolkata, aims to enhance the water distribution infrastructure, ensuring reliable access to clean water for local residents. This installation is a crucial step toward addressing the growing water demand and supporting future urban growth in the area. The project focuses on installing durable and high-capacity water pipelines, aiming for long-term sustainability and resilience against common infrastructural challenges.

          #### Duration:
          1 month

          #### Objectives:
          - Establish an efficient and sustainable water distribution network.
          - Reduce water supply disruptions through robust pipeline systems.
          - Minimize maintenance needs by utilizing high-quality materials.

          #### Resources Utilized:
          - **Cement:** Essential for securing pipeline connections and ensuring structural integrity.
          - **PVC Pipes:** High-durability pipes were selected to reduce the risk of corrosion and leakage.
          - **Wire Mesh:** Reinforced with wire mesh to enhance the structural resilience of the pipeline installations.

          #### Project Cost:
          Total: ₹100,000

          #### Project Implementation:
          The project was executed by a team of skilled personnel, ensuring adherence to quality standards and project timelines. Regular quality assessments were conducted to verify the secure placement and alignment of pipes and connections.

          #### Outcomes and Impact:
          This project successfully strengthened the water supply infrastructure in Ward 40, providing a consistent and safe water supply for the community. Additionally, the project’s success has set a precedent for similar infrastructure improvements in other areas.

          #### Additional Notes:
          N/A
      `;
      const result = await model.generateContent(report);
      const cleanReport = result.response
        .text()
        // .replace(/[#\*]/g, '')  // Removes asterisks and hashes
        .trim(); // Removes leading and trailing whitespaces
      setGeneratedReport(cleanReport);
    } catch (error) {
      console.error("Failed to generate report", error);
    }
    setIsGenerating(false);
  };

  const downloadReport = (): void => {
    const element = document.createElement("a");
    const file = new Blob([generatedReport], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `project_report-${reportData.projectName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    const resizeHandle = resizeRef.current;
    const reportContainer = reportRef.current;
    if (!resizeHandle || !reportContainer) return;

    let startY: number;
    let startHeight: number;

    const onMouseDown = (e: MouseEvent) => {
      startY = e.clientY;
      startHeight = reportContainer.offsetHeight;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startY;
      setReportHeight(Math.max(64, startHeight + delta)); // Minimum height of 64px
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    resizeHandle.addEventListener("mousedown", onMouseDown);

    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
            Departmental Insights
          </h1>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <div className="md:col-span-2 flex flex-col">
            <Card className="flex-1 h-full">
              <CardHeader>
                <CardTitle>Projects List</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <div
                  style={{ height: "200px" }}
                  className={projects.length === 0 ? "flex items-center" : ""}
                >
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <Collapsible key={project.id} className="mb-2">
                        <CollapsibleTrigger className="w-full text-left p-2 bg-secondary rounded-md hover:bg-secondary/80">
                          {project.name}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-2 bg-secondary/20 rounded-md mt-1">
                          <p>Status: {project.status}</p>
                          <p>Timeline: {project.timeline}</p>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-2xl">
                      No Projects found, head{" "}
                      <LinkPreview
                        url="/dashboard"
                        isStatic
                        imageSrc="/dashboard.jpeg"
                        className="dark:text-blue-600 text-blue-600"
                      >
                        here
                      </LinkPreview>{" "}
                      to schedule your first project!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 mt-3">
              <CardHeader>
                <CardTitle>Project Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  {/* {isClient && (
                    <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {projectLocations.map((loc) => (
                        <Marker key={loc.id} position={loc.position}>
                          <Popup>{loc.name}</Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  )} */}
                  {/* <LeafletMap /> */}
                  <MapComponent />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col">
            <Card className="mb-4 flex-1 h-full">
              <CardHeader>
                <CardTitle></CardTitle>
              </CardHeader>
              <CardContent>
              <ProposalDialog token={token!} />
              <TenderDialog token={token!} />
              </CardContent>
            </Card>
            <Card className="flex-1">
            <CardHeader>
                <CardTitle>Project Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "200px" }}>
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </CardContent>

              {/* <CardHeader>
                <CardTitle>Available Resources</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <div style={{ height: "300px" }}>
                  <ul>
                    {resources.map((resource, index) => (
                      <Collapsible key={index} className="mb-2">
                        <CollapsibleTrigger className="w-full text-left p-2 bg-secondary rounded-md hover:bg-secondary/80">
                          {resource.name}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-2 bg-secondary/20 rounded-md mt-1">
                          <p>
                            Amount: {resource.amount} {resource.unit}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </ul>
                </div>
              </CardContent> */}
            </Card>
          </div>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Report Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={reportData.projectName}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={reportData.location}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="timeTaken">Time Taken</Label>
                <Input
                  id="timeTaken"
                  name="timeTaken"
                  value={reportData.timeTaken}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="resourcesUsed">Resources Used</Label>
                <Input
                  id="resourcesUsed"
                  name="resourcesUsed"
                  value={reportData.resourcesUsed}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  name="cost"
                  value={reportData.cost}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="otherDetails">Other Details</Label>
                <Textarea
                  id="otherDetails"
                  name="otherDetails"
                  value={reportData.otherDetails}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              </div>
              <div>
                <Label htmlFor="generatedReport">Generated Report</Label>
                <div className="relative">
                  <div
                    ref={reportRef}
                    className="border rounded-md p-4 mb-2 overflow-y-auto bg-background"
                    style={{ height: `${reportHeight}px` }}
                  >
                    <ReactMarkdown className="text-sm">
                      {generatedReport}
                    </ReactMarkdown>
                  </div>
                  <div
                    ref={resizeRef}
                    className="absolute bottom-0 left-0 right-0 h-2 bg-secondary cursor-ns-resize"
                    aria-hidden="true"
                  />
                </div>
                <Button
                  onClick={downloadReport}
                  className="w-full"
                  disabled={!generatedReport}
                >
                  Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  );
}
