"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic
import Navbar from "@/components/functions/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "../_contexts/authcontext";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamically import Leaflet components only on client-side
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function OngoingProjects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  // const [projects] = useState([
  //   { id: 1, name: "Project A", status: "In Progress", timeline: "Q3 2024" },
  //   { id: 2, name: "Project B", status: "Planning", timeline: "Q4 2024" },
  //   { id: 3, name: "Project C", status: "In Progress", timeline: "Q2 2024" },
  //   { id: 4, name: "Project D", status: "Completed", timeline: "Q1 2024" },
  //   { id: 5, name: "Project E", status: "Upcoming", timeline: "Q1 2025" },
  //   { id: 6, name: "Project F", status: "Upcoming", timeline: "Q1 2025" },
  //   { id: 7, name: "Project G", status: "Upcoming", timeline: "Q1 2025" },
  // ]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/myProject", {
          method: "POST",
          headers: {
            Authorization: token,
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

  const [resources] = useState([
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

  const chartData = {
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
        position: "right",
      },
    },
  };

  const mapCenter = [22.5744, 88.3629]; // Example coordinates
  const projectLocations = [
    { id: 1, position: [22.5744, 88.3629], name: "Project A" },
    { id: 2, position: [51.51, -0.1], name: "Project B" },
    { id: 3, position: [51.49, -0.08], name: "Project C" },
  ];

  const [isClient, setIsClient] = useState(false);
  const [reportData, setReportData] = useState({
    projectName: "",
    location: "",
    timeTaken: "",
    resourcesUsed: "",
    cost: "",
    otherDetails: "",
  });
  const [generatedReport, setGeneratedReport] = useState("");

  // Set `isClient` to true when the component has mounted on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateReport = () => {
    // This is a mock function. In a real application, you'd call an AI service here.
    const report = `
        Project Report

        Project Name: ${reportData.projectName}
        Location: ${reportData.location}
        Time Taken: ${reportData.timeTaken}
        Resources Used: ${reportData.resourcesUsed}
        Cost: ${reportData.cost}

        Other Details:
        ${reportData.otherDetails}

        This report was generated automatically based on the provided information.
      `;
    setGeneratedReport(report);
  };

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedReport], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "project_report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
          Departmental Insights
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <div className="md:col-span-2 flex flex-col">
            <Card className="flex-1 h-full">
              <CardHeader>
                <CardTitle>Projects List</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <div style={{ height: "200px" }}>
                  {projects.map((project) => (
                    <Collapsible key={project.id} className="mb-2">
                      <CollapsibleTrigger className="w-full text-left p-2 bg-secondary rounded-md hover:bg-secondary/80">
                        {project.name}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-2 bg-secondary/20 rounded-md mt-1">
                        <p>Status: {project.status}</p>
                        <p>Timeline: {project.timeline}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 mt-3">
              <CardHeader>
                <CardTitle>Project Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  {isClient && (
                    <MapContainer
                      className="z-20"
                      center={mapCenter}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {projectLocations.map((loc) => (
                        <Marker key={loc.id} position={loc.position}>
                          <Popup>{loc.name}</Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col">
            <Card className="mb-4 flex-1 h-full">
              <CardHeader>
                <CardTitle>Project Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "200px" }}>
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader>
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
              </CardContent>
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
                <Button onClick={generateReport} className="w-full">
                  Generate Report
                </Button>
              </div>
              <div>
                <Label htmlFor="generatedReport">Generated Report</Label>
                <Textarea
                  id="generatedReport"
                  value={generatedReport}
                  readOnly
                  className="h-64 mb-2"
                />
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
    </>
  );
}
