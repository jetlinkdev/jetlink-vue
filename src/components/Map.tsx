import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useOrder } from '../context/OrderContext';
import { pickupIcon, destinationIcon } from '../utils/mapIcons';
import { MAP_CONFIG, TILE_LAYER, OSRM_URL } from '../config/constants';

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface RouteDrawerProps {
  pickupLocation: { lat: number; lon: number } | null;
  destinationLocation: { lat: number; lon: number } | null;
  onRouteDrawn: (distance: number, coordinates: [number, number][]) => void;
}

function RouteDrawer({ pickupLocation, destinationLocation, onRouteDrawn }: RouteDrawerProps) {
  const map = useMapEvents({});
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!pickupLocation || !destinationLocation) {
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
      return;
    }

    const drawRoute = async () => {
      try {
        const response = await fetch(
          `${OSRM_URL}/route/v1/driving/${pickupLocation.lon},${pickupLocation.lat};${destinationLocation.lon},${destinationLocation.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );

          if (routeLineRef.current) {
            map.removeLayer(routeLineRef.current);
          }

          routeLineRef.current = L.polyline(coordinates, {
            color: '#4CAF50',
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10',
          }).addTo(map);

          const group = L.featureGroup([
            ...(pickupLocation ? [L.marker([pickupLocation.lat, pickupLocation.lon], { icon: pickupIcon })] : []),
            ...(destinationLocation ? [L.marker([destinationLocation.lat, destinationLocation.lon], { icon: destinationIcon })] : []),
            routeLineRef.current,
          ]);

          map.fitBounds(group.getBounds(), { padding: [50, 50] });

          const distance = route.distance / 1000; // Convert to km
          onRouteDrawn(distance, coordinates);
        }
      } catch (error) {
        console.error('Routing error:', error);
      }
    };

    drawRoute();

    return () => {
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
    };
  }, [pickupLocation, destinationLocation, map, onRouteDrawn]);

  return null;
}

interface MapProps {
  center: [number, number];
  zoom: number;
  onMapClick: (lat: number, lng: number) => void;
  onRouteDrawn: (distance: number, coordinates: [number, number][]) => void;
}

export function Map({ center, zoom, onMapClick, onRouteDrawn }: MapProps) {
  const { pickupLocation, destinationLocation } = useOrder();

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="absolute inset-0 z-10"
      zoomControl={false}
    >
      <TileLayer
        url={TILE_LAYER.URL}
        attribution={TILE_LAYER.ATTRIBUTION}
        maxZoom={MAP_CONFIG.maxZoom}
      />
      <MapClickHandler onMapClick={onMapClick} />
      <RouteDrawer
        pickupLocation={pickupLocation}
        destinationLocation={destinationLocation}
        onRouteDrawn={onRouteDrawn}
      />
      {pickupLocation && (
        <Marker
          position={[pickupLocation.lat, pickupLocation.lon]}
          icon={pickupIcon}
        />
      )}
      {destinationLocation && (
        <Marker
          position={[destinationLocation.lat, destinationLocation.lon]}
          icon={destinationIcon}
        />
      )}
    </MapContainer>
  );
}
