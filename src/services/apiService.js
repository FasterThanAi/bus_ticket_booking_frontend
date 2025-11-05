const API_URL = 'http://localhost:8080/api';

// Public API CALL
export const searchBuses = async (source, destination, date) => {
  try {
    const query = new URLSearchParams({ source, destination, date }).toString();
    const response = await fetch(`${API_URL}/search?${query}`);

    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    return response.json();
  } catch (err) {
    console.error('Search error:', err);
    throw err;
  }
};
// Helper function to handle API requests
const apiRequest = async (url, method, body, token) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || `Failed to ${method} data`);
  }

  return response.json();
};

// --- Admin API Calls ---

export const adminAddBus = (busData, token) => {
  return apiRequest(`${API_URL}/admin/bus`, 'POST', busData, token);
};

export const adminAddRoute = (routeData, token) => {
  return apiRequest(`${API_URL}/admin/route`, 'POST', routeData, token);
};

export const adminAddSchedule = (scheduleData, token) => {
  return apiRequest(`${API_URL}/admin/schedule`, 'POST', scheduleData, token);
};

// delete
export const adminDeleteBus = (busId, token) => {
  return apiRequest(`${API_URL}/admin/bus/${busId}`, 'DELETE', null, token);
};

export const adminDeleteRoute = (routeId, token) => {
  return apiRequest(`${API_URL}/admin/route/${routeId}`, 'DELETE', null, token);
};

export const adminDeleteSchedule = (scheduleId, token) => {
  return apiRequest(`${API_URL}/admin/schedule/${scheduleId}`, 'DELETE', null, token);
}

export const adminUpdateSchedule = (scheduleId, scheduleData, token) => {
  return apiRequest(`${API_URL}/admin/schedule/${scheduleId}`, 'PUT', scheduleData, token);
};
// ... we can add all our other API calls here later ...

// --- User API Calls ---

export const bookTicket = (bookingData, token) => {
  return apiRequest(`${API_URL}/book`, 'POST', bookingData, token);
};

export const cancelTicket = (bookingId, token) => {
  return apiRequest(`${API_URL}/cancel`, 'POST', { bookingId }, token);
};

export const getMyBookings = (userId, token) => {
  return apiRequest(`${API_URL}/bookings/${userId}`, 'GET', null, token);
};

export const getBookingDetails = (bookingId, token) => {
  return apiRequest(`${API_URL}/booking/${bookingId}`, 'GET', null, token);
};