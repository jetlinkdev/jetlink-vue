import { useOrder } from '../context/OrderContext';

interface DriverAssignedPanelProps {
  onBackToHome: () => void;
}

export function DriverAssignedPanel({ onBackToHome }: DriverAssignedPanelProps) {
  const { assignedDriver, pickupAddress, destinationAddress } = useOrder();

  if (!assignedDriver) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="p-6 pb-4 -m-6 mb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">✅ Driver Found!</h1>
        <p className="text-sm text-gray-600">Your driver is on the way</p>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {assignedDriver.driver_name?.charAt(0) || 'D'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{assignedDriver.driver_name || 'Driver'}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>⭐</span>
              <span className="font-medium">{assignedDriver.rating || '4.8'}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/50 rounded-lg p-2">
            <p className="text-gray-500 text-xs">Vehicle</p>
            <p className="font-medium text-gray-900">{assignedDriver.vehicle || 'Toyota Avanza'}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-2">
            <p className="text-gray-500 text-xs">Plate Number</p>
            <p className="font-medium text-gray-900">{assignedDriver.plate_number || 'B 1234 XYZ'}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-2">
            <p className="text-gray-500 text-xs">ETA</p>
            <p className="font-medium text-gray-900">{assignedDriver.eta_minutes || '5'} min</p>
          </div>
          <div className="bg-white/50 rounded-lg p-2">
            <p className="text-gray-500 text-xs">Price</p>
            <p className="font-medium text-primary">
              Rp {assignedDriver.bid_price?.toLocaleString('id-ID') || '0'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Trip Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              A
            </span>
            <p className="text-gray-600 truncate">{pickupAddress}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              B
            </span>
            <p className="text-gray-600 truncate">{destinationAddress}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onBackToHome}
        className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
      >
        Back to Home
      </button>
    </div>
  );
}
