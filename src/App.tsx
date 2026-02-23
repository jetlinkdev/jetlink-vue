import { useState, useCallback, useEffect } from 'react';
import { OrderProvider, useOrder } from './context/OrderContext';
import { useWebSocket } from './hooks/useWebSocket';
import { useGeolocation } from './hooks/useGeolocation';
import { Map } from './components/Map';
import { BookingPanel } from './components/BookingPanel';
import { WaitingBidsPanel } from './components/WaitingBidsPanel';
import { DriverAssignedPanel } from './components/DriverAssignedPanel';
import { ConnectionStatus as ConnectionStatusComponent } from './components/ConnectionStatus';
import { MapLegend } from './components/MapLegend';
import { LoginDialog } from './components/LoginDialog';
import { Bid, WebSocketMessage } from './types';
import { DEFAULT_LOCATION, MAP_CONFIG } from './config/constants';
import { authService } from './services/authService';

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-[2000] animate-[slideIn_0.3s_ease-out]"
    >
      <div className="flex items-center gap-2">
        <span>{type === 'success' ? '✅' : '📬'}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

function AppContent() {
  const {
    orderState,
    setOrderState,
    setPickupLocation,
    setDestinationLocation,
    resetLocations,
    calculatePrice,
    setCurrentOrderId,
    addBid,
    setAssignedDriver,
    createOrderMessage,
    cancelOrderMessage,
    acceptBidMessage,
    pickupLocation,
    destinationLocation,
    user,
    setUser,
  } = useOrder();

  const [mapCenter, setMapCenter] = useState<[number, number]>(
    [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]
  );
  const [mapZoom, setMapZoom] = useState(MAP_CONFIG.defaultZoom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { location: geoLocation, getCurrentLocation: getGeoLocation } = useGeolocation();

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState((authUser) => {
      setUser(authUser);
      setIsLoggedIn(!!authUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    authService.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setOrderState('booking');
    resetLocations();
    setCurrentOrderId(null);
    setAssignedDriver(null);
  }, [setUser, setOrderState, resetLocations, setCurrentOrderId]);

  const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
    console.log('Received message:', data);

    switch (data.intent) {
      case 'order_created':
        console.log('Order created successfully:', data.data);
        // Backend returns order ID as number
        const orderId = data.data as number;
        setCurrentOrderId(orderId.toString());
        setOrderState('waiting_bids');
        break;

      case 'new_bid_received':
        console.log('New bid received:', data.data);
        const bid = (data.data as { bid?: Bid })?.bid || (data.data as Bid);
        if (bid) {
          addBid(bid);
          setToast({ message: 'New bid received!', type: 'info' });
        }
        break;

      case 'bid_accepted':
        console.log('Bid accepted:', data.data);
        break;

      case 'bid_rejected':
        setToast({ message: 'Your bid was rejected.', type: 'info' });
        break;

      case 'driver_arrived':
        setToast({ message: 'Driver has arrived at pickup location!', type: 'success' });
        break;

      case 'trip_completed':
        setToast({ message: 'Trip completed successfully!', type: 'success' });
        break;

      case 'order_cancelled':
        console.log('Order cancelled:', data.data);
        setIsSubmitting(false);
        setOrderState('booking');
        resetLocations();
        setToast({ message: 'Order cancelled successfully', type: 'info' });
        break;

      case 'error':
        console.error('Error from server:', data.data);
        setToast({
          message: `Error: ${(data.data as { message?: string })?.message || 'Unknown error'}`,
          type: 'info',
        });
        break;

      default:
        console.log('Unhandled message intent:', data.intent);
    }
  }, [setCurrentOrderId, setOrderState, addBid, resetLocations]);

  const { status, sendMessage } = useWebSocket(handleWebSocketMessage);

  // Handle geolocation result
  useEffect(() => {
    if (geoLocation && !geoLocation.error) {
      setMapCenter([geoLocation.lat, geoLocation.lng]);
      setMapZoom(MAP_CONFIG.locationZoom);
      setIsGettingLocation(false);
      setToast({ message: 'Location found!', type: 'success' });
    }
  }, [geoLocation]);

  const handleGetCurrentLocation = useCallback(() => {
    setIsGettingLocation(true);
    getGeoLocation();
  }, [getGeoLocation]);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      if (!pickupLocation) {
        // Set pickup location
        setPickupLocation({ lat, lon: lng }, address);
      } else if (!destinationLocation) {
        // Set destination location
        setDestinationLocation({ lat, lon: lng }, address);
      } else {
        // Both set - reset to new pickup
        setPickupLocation({ lat, lon: lng }, address);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      const coords = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      if (!pickupLocation) {
        setPickupLocation({ lat, lon: lng }, coords);
      } else if (!destinationLocation) {
        setDestinationLocation({ lat, lon: lng }, coords);
      } else {
        setPickupLocation({ lat, lon: lng }, coords);
      }
    }
  }, [pickupLocation, destinationLocation, setPickupLocation, setDestinationLocation]);

  const handleRouteDrawn = useCallback((distance: number) => {
    calculatePrice(distance);
  }, [calculatePrice]);

  const handleSubmitOrder = useCallback(() => {
    const message = createOrderMessage();
    if (message) {
      setIsSubmitting(true);
      sendMessage(message);
    }
  }, [createOrderMessage, sendMessage]);

  const handleCancelOrder = useCallback(() => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setIsSubmitting(false);
      const message = cancelOrderMessage();
      if (message) {
        sendMessage(message);
      }
    }
  }, [cancelOrderMessage, sendMessage]);

  const handleAcceptBid = useCallback((bid: Bid) => {
    console.log('Accepting bid:', bid);
    const message = acceptBidMessage(bid);
    if (message) {
      sendMessage(message);
    }

    setAssignedDriver({
      driver_name: bid.driver_name,
      rating: bid.rating,
      vehicle: bid.vehicle,
      plate_number: bid.plate_number,
      eta_minutes: bid.eta_minutes,
      bid_price: bid.bid_price,
    });
    setOrderState('driver_assigned');
    setToast({ message: 'Driver accepted! They are on the way.', type: 'success' });
  }, [acceptBidMessage, sendMessage, setAssignedDriver, setOrderState]);

  const handleDeclineBid = useCallback((bid: Bid) => {
    console.log('Declining bid:', bid);
    setToast({ message: 'Bid declined', type: 'info' });
  }, []);

  const handleBackToHome = useCallback(() => {
    setIsSubmitting(false);
    setOrderState('booking');
    resetLocations();
    setAssignedDriver(null);
  }, [setOrderState, resetLocations, setAssignedDriver]);

  // Initialize map with current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter([lat, lng]);
          console.log('Map initialized with current location:', lat, lng);
        },
        () => {
          console.warn('Geolocation not available, using default location');
          setMapCenter([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn('Geolocation not supported, using default location');
      setMapCenter([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
    }
  }, []);

  return (
    <>
      {/* Show Login Dialog if not logged in */}
      {!isLoggedIn && <LoginDialog onLoginSuccess={handleLoginSuccess} />}

      <Map
        center={mapCenter}
        zoom={mapZoom}
        onMapClick={handleMapClick}
        onRouteDrawn={handleRouteDrawn}
      />

      <div className="order-panel absolute top-5 right-5 w-[380px] max-h-[calc(100vh-40px)] bg-white rounded-2xl shadow-xl z-[1000] overflow-y-auto custom-scrollbar">
        {orderState === 'booking' && (
          <>
            <div className="p-6 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <h1 className="text-2xl font-bold text-gray-900">🚗 Book Your Ride</h1>
                {user && (
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                    title="Logout"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Enter your trip details below</p>
                {user && (
                  <div className="flex items-center gap-2">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                      {user.displayName || user.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <BookingPanel
              onSubmit={handleSubmitOrder}
              isSubmitting={isSubmitting}
              getCurrentLocation={handleGetCurrentLocation}
              isGettingLocation={isGettingLocation}
            />
          </>
        )}

        {orderState === 'waiting_bids' && (
          <>
            <div className="p-6 pb-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">🚗 Finding Nearby Drivers</h1>
              <p className="text-sm text-gray-600">Waiting for driver bids...</p>
            </div>
            <WaitingBidsPanel
              onAcceptBid={handleAcceptBid}
              onDeclineBid={handleDeclineBid}
              onCancelOrder={handleCancelOrder}
            />
          </>
        )}

        {orderState === 'driver_assigned' && (
          <DriverAssignedPanel onBackToHome={handleBackToHome} />
        )}
      </div>

      <MapLegend />
      <ConnectionStatusComponent status={status} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <AppContent />
    </OrderProvider>
  );
}
