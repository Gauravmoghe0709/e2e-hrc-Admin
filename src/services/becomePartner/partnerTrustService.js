const API_BASE = '/api';

export const getAllPartnerTrust = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/partner-trust`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error fetching partner trust records:', error.response?.data || error.message);
    throw error;
  }
};

export const getPartnerTrustById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/admin/partner-trust/${id}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error fetching partner trust record:', error.response?.data || error.message);
    throw error;
  }
};

export const createPartnerTrust = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/admin/partner-trust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating partner trust:', error.response?.data || error.message);
    throw error;
  }
};

export const updatePartnerTrust = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/admin/partner-trust/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating partner trust:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePartnerTrust = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/admin/partner-trust/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting partner trust:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  getAllPartnerTrust,
  getPartnerTrustById,
  createPartnerTrust,
  updatePartnerTrust,
  deletePartnerTrust,
};
