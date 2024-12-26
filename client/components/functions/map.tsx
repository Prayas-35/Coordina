"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicHJheWFzLTM1IiwiYSI6ImNsdnM5ZzBiaDB1bzEyam8xMW5xY3d5a3EifQ.apcs5X5zHPF0iXmUcEs07A';

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);

  const initialZoom = 12;

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setCurrentPosition([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !currentPosition) return;

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: currentPosition, // Use current position as the center
      zoom: initialZoom, // Starting zoom level
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add a click event listener
    mapRef.current.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      alert(`Coordinates: Longitude ${lng}, Latitude ${lat}`);
    });

    // Cleanup on component unmount
    return () => {
      mapRef.current?.remove();
    };
  }, [currentPosition, initialZoom]);

  return (
    <div
      ref={mapContainerRef}
      className='inset-0 h-full'
    />
  );
};

export default Map;