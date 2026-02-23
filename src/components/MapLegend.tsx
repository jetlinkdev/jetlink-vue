export function MapLegend() {
  return (
    <div className="absolute bottom-5 left-5 bg-white px-4 py-3 rounded-xl shadow-md z-[1000] text-xs">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
          A
        </span>
        <span>Pickup Location</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
          B
        </span>
        <span>Destination</span>
      </div>
    </div>
  );
}
