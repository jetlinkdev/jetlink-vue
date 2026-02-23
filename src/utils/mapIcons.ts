import L from 'leaflet';

export const pickupIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: #4CAF50; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">A</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export const destinationIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: #f44336; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">B</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});
