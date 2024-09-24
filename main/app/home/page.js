"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/functions/NavBar";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function OngoingProjects() {
  const [projects] = useState([
    { id: 1, name: "Project A", status: "In Progress", timeline: "Q3 2024" },
    { id: 2, name: "Project B", status: "Planning", timeline: "Q4 2024" },
    { id: 3, name: "Project C", status: "In Progress", timeline: "Q2 2024" },
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

  const mapCenter = [51.505, -0.09]; // Example coordinates (London)
  const projectLocations = [
    { id: 1, position: [51.505, -0.09], name: "Project A" },
    { id: 2, position: [51.51, -0.1], name: "Project B" },
    { id: 3, position: [51.49, -0.08], name: "Project C" },
  ];

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-4xl font-bold text-center mb-8 mt-6 bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">Ongoing Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Projects List</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Project Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: "200px" }}>
                <Pie data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <MapContainer
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
