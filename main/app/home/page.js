"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Navbar from "@/components/functions/NavBar";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Leaflet components
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function OngoingProjects() {
  const [projects] = useState([
    { id: 1, name: "Project A", status: "In Progress", timeline: "Q3 2024" },
    { id: 2, name: "Project B", status: "Planning", timeline: "Q4 2024" },
    { id: 3, name: "Project C", status: "In Progress", timeline: "Q2 2024" },
    { id: 4, name: "Project D", status: "Completed", timeline: "Q1 2024" },
    { id: 5, name: "Project E", status: "Upcoming", timeline: "Q1 2025" },
    { id: 6, name: "Project F", status: "Upcoming", timeline: "Q1 2025" },
    { id: 7, name: "Project G", status: "Upcoming", timeline: "Q1 2025" },
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
    { id: 1, position: [51.505, -0.09], name: "Project A" },
    { id: 2, position: [51.51, -0.1], name: "Project B" },
    { id: 3, position: [51.49, -0.08], name: "Project C" },
  ];

  const [isClient, setIsClient] = useState(false);

  // Set `isClient` to true when the component has mounted on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
          Ongoing Projects
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
                <CardTitle>Project Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  {isClient && (
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
