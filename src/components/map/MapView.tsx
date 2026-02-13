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
  showBoundaries?: boolean;
  showTerritories?: boolean;
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

// Limites approximatives de la province du Lualaba (GeoJSON)
const LUALABA_BOUNDARY = {
  type: "Feature" as const,
  properties: { name: "Province du Lualaba" },
  geometry: {
    type: "Polygon" as const,
    coordinates: [
      [
        [23.0, -9.0],
        [24.0, -8.5],
        [25.5, -8.5],
        [27.0, -9.0],
        [27.5, -10.0],
        [27.5, -11.0],
        [27.0, -12.0],
        [26.0, -12.5],
        [24.5, -12.5],
        [23.5, -12.0],
        [23.0, -11.0],
        [23.0, -10.0],
        [23.0, -9.0],
      ],
    ],
  },
};

// Territoires du Lualaba
const LUALABA_TERRITORIES = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Kolwezi", type: "ville" },
      geometry: {
        type: "Point" as const,
        coordinates: [25.4667, -10.7167],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Dilolo", type: "territoire" },
      geometry: {
        type: "Point" as const,
        coordinates: [22.35, -10.68],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Kapanga", type: "territoire" },
      geometry: {
        type: "Point" as const,
        coordinates: [22.58, -8.35],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sandoa", type: "territoire" },
      geometry: {
        type: "Point" as const,
        coordinates: [22.95, -9.68],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Lubudi", type: "territoire" },
      geometry: {
        type: "Point" as const,
        coordinates: [25.85, -9.85],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Mutshatsha", type: "territoire" },
      geometry: {
        type: "Point" as const,
        coordinates: [25.45, -10.35],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Bunkeya", type: "chefferie" },
      geometry: {
        type: "Point" as const,
        coordinates: [26.97, -10.38],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Fungurume", type: "secteur" },
      geometry: {
        type: "Point" as const,
        coordinates: [26.31, -10.55],
      },
    },
  ],
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
  showBoundaries = false,
  showTerritories = true,
  height = "400px",
  className = "",
  interactive = true,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
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
      if (!map.current) return;

      // Ajouter les limites de la province du Lualaba
      map.current.addSource("lualaba-boundary", {
        type: "geojson",
        data: LUALABA_BOUNDARY as GeoJSON.Feature,
      });

      // Ligne de frontière
      map.current.addLayer({
        id: "lualaba-boundary-line",
        type: "line",
        source: "lualaba-boundary",
        paint: {
          "line-color": "#1e3a8a",
          "line-width": 3,
          "line-dasharray": [3, 2],
        },
      });

      // Remplissage semi-transparent
      map.current.addLayer({
        id: "lualaba-boundary-fill",
        type: "fill",
        source: "lualaba-boundary",
        paint: {
          "fill-color": "#1e3a8a",
          "fill-opacity": 0.05,
        },
      });

      // Ajouter les territoires
      map.current.addSource("lualaba-territories", {
        type: "geojson",
        data: LUALABA_TERRITORIES as unknown as GeoJSON.FeatureCollection,
      });

      // Labels des territoires
      map.current.addLayer({
        id: "territory-labels",
        type: "symbol",
        source: "lualaba-territories",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#374151",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      // Cercles pour les territoires
      map.current.addLayer({
        id: "territory-circles",
        type: "circle",
        source: "lualaba-territories",
        paint: {
          "circle-radius": 8,
          "circle-color": [
            "match",
            ["get", "type"],
            "ville",
            "#1e3a8a",
            "territoire",
            "#16a34a",
            "chefferie",
            "#f59e0b",
            "secteur",
            "#dc2626",
            "#6b7280",
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      setMapLoaded(true);
    });

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center.lat, center.lng, zoom, interactive]);

  // Gérer la visibilité des couches
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Visibilité des limites
    const boundaryVisibility = showBoundaries ? "visible" : "none";
    if (map.current.getLayer("lualaba-boundary-line")) {
      map.current.setLayoutProperty(
        "lualaba-boundary-line",
        "visibility",
        boundaryVisibility,
      );
    }
    if (map.current.getLayer("lualaba-boundary-fill")) {
      map.current.setLayoutProperty(
        "lualaba-boundary-fill",
        "visibility",
        boundaryVisibility,
      );
    }

    // Visibilité des territoires
    const territoriesVisibility = showTerritories ? "visible" : "none";
    if (map.current.getLayer("territory-labels")) {
      map.current.setLayoutProperty(
        "territory-labels",
        "visibility",
        territoriesVisibility,
      );
    }
    if (map.current.getLayer("territory-circles")) {
      map.current.setLayoutProperty(
        "territory-circles",
        "visibility",
        territoriesVisibility,
      );
    }
  }, [mapLoaded, showBoundaries, showTerritories]);

  // Ajouter les marqueurs quand la carte est chargée
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

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
      const marker = new mapboxgl.Marker(el)
        .setLngLat(point.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
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
