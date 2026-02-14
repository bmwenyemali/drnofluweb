"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_CONFIG } from "@/lib/config";

// Types pour les points sur la carte
export type MapPointType = "direction" | "recette" | "projet" | "mine";

export interface MapPoint {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: MapPointType;
  address?: string;
  phone?: string;
  email?: string;
}

interface MapViewProps {
  center?: { lng: number; lat: number };
  zoom?: number;
  // Dynamic data from database
  siegePoints?: MapPoint[];
  recettePoints?: MapPoint[];
  projetPoints?: MapPoint[];
  minePoints?: MapPoint[];
  // Visibility toggles
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

// Icônes SVG pour chaque type (inline SVG pour correspondre à la légende)
const POINT_SVG_ICONS: Record<MapPointType, string> = {
  direction: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
  recette: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
  projet: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/></svg>`,
  mine: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4Z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>`,
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
  siegePoints = [],
  recettePoints = [],
  projetPoints = [],
  minePoints = [],
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

  // Collecter tous les points à afficher avec useMemo pour éviter des re-renders inutiles
  const pointsToShow = useMemo((): MapPoint[] => {
    const points: MapPoint[] = [];

    if (showSiege && siegePoints.length > 0) {
      points.push(...siegePoints);
    }
    if (showRecettes && recettePoints.length > 0) {
      points.push(...recettePoints);
    }
    if (showProjets && projetPoints.length > 0) {
      points.push(...projetPoints);
    }
    if (showMines && minePoints.length > 0) {
      points.push(...minePoints);
    }

    return points;
  }, [
    showSiege,
    showRecettes,
    showProjets,
    showMines,
    siegePoints,
    recettePoints,
    projetPoints,
    minePoints,
  ]);

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

  // Ajouter les marqueurs quand la carte est chargée ou que les points changent
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    pointsToShow.forEach((point) => {
      // Créer l'élément du marqueur - structure simple pour éviter les problèmes de positionnement
      const el = document.createElement("div");
      el.className = "mapbox-custom-marker";
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${POINT_COLORS[point.type]};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      `;
      el.innerHTML = POINT_SVG_ICONS[point.type];
      el.title = point.name; // Tooltip natif au hover

      // Construire le contenu du popup avec les détails supplémentaires
      let popupContent = `
        <div style="padding: 10px;">
          <h3 style="font-weight: bold; margin-bottom: 6px; color: ${POINT_COLORS[point.type]}; font-size: 16px;">
            ${point.name}
          </h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.4;">
            ${point.description}
          </p>
      `;

      if (point.address) {
        popupContent += `<p style="margin: 4px 0; color: #444; font-size: 13px;"><strong>📍</strong> ${point.address}</p>`;
      }
      if (point.phone) {
        popupContent += `<p style="margin: 4px 0; color: #444; font-size: 13px;"><strong>📞</strong> ${point.phone}</p>`;
      }
      if (point.email) {
        popupContent += `<p style="margin: 4px 0; color: #444; font-size: 13px;"><strong>✉️</strong> ${point.email}</p>`;
      }

      popupContent += `</div>`;

      // Créer le popup avec les détails
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: "320px",
      }).setHTML(popupContent);

      // Ajouter le marqueur à la carte
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(point.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, pointsToShow]);

  return (
    <div
      ref={mapContainer}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}
