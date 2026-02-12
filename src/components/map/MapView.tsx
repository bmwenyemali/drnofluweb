"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_CONFIG, MAP_POINTS } from "@/lib/config";

// Types pour les points sur la carte
export type MapPointType = "direction" | "recette" | "projet" | "mine";

interface MapPoint {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: MapPointType;
}

interface MapViewProps {
  center?: { lng: number; lat: number };
  zoom?: number;
  showSiege?: boolean;
  showRecettes?: boolean;
  showProjets?: boolean;
  showMines?: boolean;
  height?: string;
  className?: string;
  interactive?: boolean;
}

// Couleurs pour chaque type de point
const POINT_COLORS: Record<MapPointType, string> = {
  direction: "#1e3a8a", // Bleu foncé - Siège
  recette: "#16a34a", // Vert - Points de recette
  projet: "#f59e0b", // Orange - Projets
  mine: "#dc2626", // Rouge - Mines
};

// Icônes pour chaque type
const POINT_ICONS: Record<MapPointType, string> = {
  direction: "🏛️",
  recette: "💰",
  projet: "🚧",
  mine: "⛏️",
};

/**
 * Composant de carte Mapbox réutilisable
 */
export default function MapView({
  center = MAPBOX_CONFIG.defaultCenter,
  zoom = MAPBOX_CONFIG.defaultZoom,
  showSiege = true,
  showRecettes = false,
  showProjets = false,
  showMines = false,
  height = "400px",
  className = "",
  interactive = true,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Collecter tous les points à afficher
  const getPointsToShow = (): MapPoint[] => {
    const points: MapPoint[] = [];

    if (showSiege) {
      points.push(MAP_POINTS.siege);
    }
    if (showRecettes) {
      points.push(...MAP_POINTS.pointsRecettes);
    }
    if (showProjets) {
      points.push(...MAP_POINTS.projets);
    }
    if (showMines) {
      points.push(...MAP_POINTS.mines);
    }

    return points;
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialiser Mapbox
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: [center.lng, center.lat],
      zoom: zoom,
      interactive: interactive,
    });

    // Ajouter les contrôles de navigation
    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        "top-right",
      );
    }

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center.lat, center.lng, zoom, interactive]);

  // Ajouter les marqueurs quand la carte est chargée
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const points = getPointsToShow();

    points.forEach((point) => {
      // Créer un élément HTML pour le marqueur
      const el = document.createElement("div");
      el.className = "mapbox-marker";
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${POINT_COLORS[point.type]};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `;
      el.innerHTML = POINT_ICONS[point.type];
      el.onmouseenter = () => (el.style.transform = "scale(1.2)");
      el.onmouseleave = () => (el.style.transform = "scale(1)");

      // Créer le popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 4px; color: ${POINT_COLORS[point.type]};">
            ${point.name}
          </h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            ${point.description}
          </p>
        </div>
      `);

      // Ajouter le marqueur à la carte
      new mapboxgl.Marker(el)
        .setLngLat(point.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [mapLoaded, showSiege, showRecettes, showProjets, showMines]);

  return (
    <div
      ref={mapContainer}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}
