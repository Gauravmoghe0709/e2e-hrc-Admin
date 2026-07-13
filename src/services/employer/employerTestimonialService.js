const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Public Testimonials
export const getPublicTestimonials = async () => {
  const response = await fetch('/api/testimonials', {
    credentials: 'include',
  });
  return handleResponse(response);
};

// Testimonial Section
export const getAdminTestimonialSection = async () => {
  const response = await fetch('/api/admin/testimonial-section', {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const createTestimonialSection = async (payload) => {
  const response = await fetch('/api/admin/testimonial-section', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const updateTestimonialSection = async (id, payload) => {
  const response = await fetch(`/api/admin/testimonial-section/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteTestimonialSection = async (id) => {
  const response = await fetch(`/api/admin/testimonial-section/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

// Testimonial Cards
export const getAdminTestimonialCards = async () => {
  const response = await fetch('/api/admin/testimonial-cards', {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const getAdminTestimonialCardById = async (id) => {
  const response = await fetch(`/api/admin/testimonial-cards/${id}`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const createTestimonialCard = async (formData) => {
  const response = await fetch('/api/admin/testimonial-cards', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

export const updateTestimonialCard = async (id, payload) => {
  const response = await fetch(`/api/admin/testimonial-cards/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const updateTestimonialCardLogo = async (id, formData) => {
  const response = await fetch(`/api/admin/testimonial-cards/${id}/company-logo`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

export const deleteTestimonialCard = async (id) => {
  const response = await fetch(`/api/admin/testimonial-cards/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};
