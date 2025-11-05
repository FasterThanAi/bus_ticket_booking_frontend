import React from 'react';

// Helper to format date
const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', { timeStyle: 'short', dateStyle: 'short' });

function BusListItem({ bus, onBook }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md border">
      <div className="flex-1 mb-4 md:mb-0">
        <strong className="text-xl text-blue-800">{bus.BusType}</strong>
        <p className="text-gray-600">Reg: {bus.RegNumber}</p>
        <p className="text-sm text-gray-500">
          Dep: <span className="font-semibold">{formatDate(bus.DepartureTime)}</span> | 
          Arr: <span className="font-semibold">{formatDate(bus.ArrivalTime)}</span>
        </p>
      </div>
      <div className="shrink-0 w-full md:w-auto md:text-right">
        <strong className="text-2xl font-bold">₹{bus.Fare}</strong>
        <p className="text-sm text-gray-500">{bus.AvailableSeats} seats left</p>
        <button 
          onClick={() => onBook(bus.ScheduleID, bus.AvailableSeats)}
          disabled={bus.AvailableSeats <= 0}
          className="w-full md:w-auto px-6 py-2 mt-2 text-md font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
        >
          {bus.AvailableSeats <= 0 ? 'Full' : 'Book'}
        </button>
      </div>
    </div>
  );
}

export default BusListItem;