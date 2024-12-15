"use client";

import React, { useEffect, useState, useRef } from "react";
import { OlaMaps } from "@/components/OlaMapsWebSDK/dist/olamaps-js-sdk.es";

interface MapComponentProps {
    height?: string;
    width?: string;
    theme?: "light" | "dark";
    onLocationChange?: (coordinates: [number, number]) => void;
    // Additional props, if any
    [key: string]: any;
}

export function MapComponent({
    height = "100%",
    width = "100%",
    theme = "light",
    onLocationChange,
}: MapComponentProps) {
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Refs to store map and marker
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        // Check if geolocation is supported
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation([longitude, latitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Unable to retrieve location");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser");
        }
    }, []);

    useEffect(() => {
        // Only initialize map when current location is available
        if (currentLocation) {
            const olaMaps = new OlaMaps({
                apiKey: ["G5RJX7p2Bfa2UWJuE73IcyfNokde0j4V9LaoPB9t"],
            });

            const map = olaMaps.init({
                container: "central-map",
                center: currentLocation,
                style: `https://api.olamaps.io/tiles/vector/v1/styles/default-${theme}-standard/style.json`,
                transformRequest: (url: string, resourceType: string) => {
                    if (url.includes("?")) {
                        url += "&api_key=G5RJX7p2Bfa2UWJuE73IcyfNokde0j4V9LaoPB9t";
                    } else {
                        url += "?api_key=G5RJX7p2Bfa2UWJuE73IcyfNokde0j4V9LaoPB9t";
                    }
                    return { url, resourceType };
                },
            });

            // Store map in ref
            mapRef.current = map;

            // Add click event listener to get coordinates and add/update marker
            map.on('click', (e: any) => {
                const { lng, lat } = e.lngLat;
                setClickedCoordinates([lng, lat]);

                if (onLocationChange) {
                    onLocationChange([lng, lat]);
                }

                // Remove existing marker if it exists
                if (markerRef.current) {
                    markerRef.current.remove();
                }

                // Create new marker
                olaMaps
                    .addMarker({ offset: [15, 15], anchor: "bottom", color: 'red' })
                    .setLngLat([lng, lat])
                    .addTo(map);

                // Store marker in ref
                markerRef.current = map.getLayer('marker');
            });

            // Optional: Return cleanup function
            return () => {
                map.remove();
                if (markerRef.current) {
                    markerRef.current.remove();
                }
            };
        }
    }, [currentLocation, theme]);

    return (
        <div>
            <div
                id="central-map"
                style={{
                    height,
                    width,
                    position: 'relative'
                }}
            >
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            {clickedCoordinates && (
                <div style={{ marginTop: '10px' }}>
                    Clicked Coordinates:
                    Longitude: {clickedCoordinates[0].toFixed(6)},
                    Latitude: {clickedCoordinates[1].toFixed(6)}
                </div>
            )}
        </div>
    );
}