import { useOrder } from '../context/OrderContext';
import { Bid } from '../types';

interface WaitingBidsPanelProps {
  onAcceptBid: (bid: Bid) => void;
  onDeclineBid: (bid: Bid) => void;
  onCancelOrder: () => void;
}

export function WaitingBidsPanel({ onAcceptBid, onDeclineBid, onCancelOrder }: WaitingBidsPanelProps) {
  const { pickupAddress, destinationAddress, priceEstimate, bids } = useOrder();

  return (
    <div className="p-6">
      {/* Loading State */}
      <div className="text-center py-6">
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🚗</span>
          </div>
        </div>
        <p className="mt-4 text-gray-700 font-medium">Searching for drivers...</p>
        <p className="text-sm text-gray-500 mt-1">⏱️ Average wait: 2-3 minutes</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              A
            </span>
            <p className="text-gray-600 truncate">{pickupAddress || '-'}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              B
            </span>
            <p className="text-gray-600 truncate">{destinationAddress || '-'}</p>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Estimated Fare</span>
            <span className="font-bold text-primary">
              Rp {priceEstimate?.totalPrice.toLocaleString('id-ID') || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Bids Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Live Bids</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
          </span>
        </div>

        {/* Bids List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {bids.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No bids yet...</p>
              <p className="text-xs mt-1">Drivers will receive your order shortly</p>
            </div>
          ) : (
            bids.map((bid) => (
              <div
                key={`${bid.driver_id}-${Date.now()}`}
                className="bid-card bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary transition-all cursor-pointer animate-[slideIn_0.3s_ease-out]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {bid.driver_name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{bid.driver_name || 'Driver'}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span>⭐</span>
                        <span className="font-medium">{bid.rating || '4.8'}</span>
                        <span>•</span>
                        <span>{bid.vehicle || 'Toyota Avanza'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      Rp {bid.bid_price?.toLocaleString('id-ID') || '0'}
                    </p>
                    <p className="text-xs text-gray-500">{bid.eta_minutes || '5'} min away</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAcceptBid(bid)}
                    className="flex-1 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onDeclineBid(bid)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancelOrder}
        className="w-full py-3 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-all duration-300"
      >
        Cancel Order
      </button>
    </div>
  );
}
