import React, { useState, useEffect } from 'react';

// Helper function to format SQL-style date to HTML input style
// "2025-11-21 10:10:00" -> "2025-11-21T10:10"
const formatDateTimeForInput = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  // Adjust for timezone offset
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  // Format to 'YYYY-MM-DDTHH:MM'
  return date.toISOString().slice(0, 16);
};

function UpdateScheduleModal({ schedule, onSave, onClose }) {
  const [formData, setFormData] = useState({
    departureTime: '',
    arrivalTime: '',
    fare: '',
    availableSeats: ''
  });

  // When the 'schedule' prop is loaded, fill the form
  useEffect(() => {
    if (schedule) {
      setFormData({
        departureTime: formatDateTimeForInput(schedule.DepartureTime),
        arrivalTime: formatDateTimeForInput(schedule.ArrivalTime),
        fare: schedule.Fare,
        availableSeats: schedule.AvailableSeats
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(schedule.ScheduleID, formData);
  };

  if (!schedule) return null; // Don't render if no schedule is selected

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content */}
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">
          Edit Schedule: {schedule.Source} to {schedule.Destination}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fare (₹)</label>
            <input
              type="number"
              name="fare"
              value={formData.fare}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Available Seats</label>
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose} // Close button
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateScheduleModal;