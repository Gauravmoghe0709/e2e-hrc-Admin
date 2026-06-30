// ─── Shared response handler ────────────────────────────────────────────────
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// ════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════════════════════════════

// GET /api/hero/home — public
export const getHeroData = async () => {
  const response = await fetch('/api/hero/home');
  if (response.status === 404) return null;
  return handleResponse(response);
};

// PUT /api/admin/hero/home — update hero text fields
export const updateHeroData = async (heroData) => {
  const response = await fetch('/api/admin/hero/home', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(heroData),
  });
  return handleResponse(response);
};

// POST /api/admin/hero/home/image — upload hero image
export const uploadHeroImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch('/api/admin/hero/home/image', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

// ════════════════════════════════════════════════════════════════════════════
// SERVICES SECTION
// ════════════════════════════════════════════════════════════════════════════

// GET /api/admin/services — all services (active + inactive) for admin
export const getAllServices = async () => {
  const response = await fetch('/api/admin/services', {
    credentials: 'include',
  });
  return handleResponse(response);
};

// POST /api/admin/services — create a new service
export const createService = async (serviceData) => {
  const response = await fetch('/api/admin/services', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceData),
  });
  return handleResponse(response);
};

// PUT /api/admin/services/:id — update a service
export const updateService = async (id, serviceData) => {
  const response = await fetch(`/api/admin/services/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceData),
  });
  return handleResponse(response);
};

// DELETE /api/admin/services/:id — delete a service
export const deleteService = async (id) => {
  const response = await fetch(`/api/admin/services/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

// POST /api/admin/services/:id/image — upload service image
export const uploadServiceImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch(`/api/admin/services/${id}/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

// ════════════════════════════════════════════════════════════════════════════
// APPROACH CARDS SECTION  (displayed as "Why Choose Us" in admin)
// ════════════════════════════════════════════════════════════════════════════

// GET /api/admin/approach-cards — all cards for admin
export const getAllApproachCards = async () => {
  const response = await fetch('/api/admin/approach-cards', {
    credentials: 'include',
  });
  return handleResponse(response);
};

// POST /api/admin/approach-cards — create a new card
export const createApproachCard = async (cardData) => {
  const response = await fetch('/api/admin/approach-cards', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  return handleResponse(response);
};

// PUT /api/admin/approach-cards/:id — update a card
export const updateApproachCard = async (id, cardData) => {
  const response = await fetch(`/api/admin/approach-cards/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  return handleResponse(response);
};

// DELETE /api/admin/approach-cards/:id — delete a card
export const deleteApproachCard = async (id) => {
  const response = await fetch(`/api/admin/approach-cards/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

// POST /api/admin/approach-cards/:id/image — upload card image
export const uploadApproachCardImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch(`/api/admin/approach-cards/${id}/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

// ════════════════════════════════════════════════════════════════════════════
// CONTACT CTA SECTION
// ════════════════════════════════════════════════════════════════════════════

// GET /api/contact-cta — fetch current CTA record
export const getContactCTA = async () => {
  const response = await fetch('/api/contact-cta');
  if (response.status === 404) return null;
  return handleResponse(response);
};

// PUT /api/admin/contact-cta — upsert (create or update) the single CTA record
export const saveContactCTA = async (ctaData) => {
  const response = await fetch('/api/admin/contact-cta', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ctaData),
  });
  return handleResponse(response);
};

// ════════════════════════════════════════════════════════════════════════════
// ABOUT US SECTION
// ════════════════════════════════════════════════════════════════════════════

// ── ABOUT HERO ──
export const getAboutHero = async () => {
  const response = await fetch('/api/about/hero');
  if (response.status === 404) return null;
  return handleResponse(response);
};

export const saveAboutHero = async (data) => {
  const response = await fetch('/api/admin/about/hero', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const uploadAboutHeroImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch('/api/admin/about/hero/image', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

// ── WHO WE ARE ──
export const getWhoWeAre = async () => {
  const response = await fetch('/api/about/whoweare');
  if (response.status === 404) return null;
  return handleResponse(response);
};

export const saveWhoWeAre = async (data) => {
  const response = await fetch('/api/admin/about/whoweare', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const uploadWhoWeAreImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch('/api/admin/about/whoweare/image', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

// ── BRIDGING THE GAP ──
export const getBridgingTheGap = async () => {
  const response = await fetch('/api/about/bridging');
  if (response.status === 404) return null;
  return handleResponse(response);
};

export const saveBridgingTheGap = async (data) => {
  const response = await fetch('/api/admin/about/bridging', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const uploadBridgingTheGapImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch('/api/admin/about/bridging/image', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

// ── TEAM MEMBERS ──
export const getTeamMembers = async () => {
  const response = await fetch('/api/admin/about/team', { credentials: 'include' });
  return handleResponse(response);
};

export const createTeamMember = async (data) => {
  const response = await fetch('/api/admin/about/team', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateTeamMember = async (id, data) => {
  const response = await fetch(`/api/admin/about/team/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteTeamMember = async (id) => {
  const response = await fetch(`/api/admin/about/team/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

export const uploadTeamMemberImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch(`/api/admin/about/team/${id}/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};

// ── ABOUT TESTIMONIALS ──
export const getAboutTestimonials = async () => {
  const response = await fetch('/api/admin/about/testimonials', { credentials: 'include' });
  return handleResponse(response);
};

export const createAboutTestimonial = async (data) => {
  const response = await fetch('/api/admin/about/testimonials', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateAboutTestimonial = async (id, data) => {
  const response = await fetch(`/api/admin/about/testimonials/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteAboutTestimonial = async (id) => {
  const response = await fetch(`/api/admin/about/testimonials/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

export const uploadAboutTestimonialImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await fetch(`/api/admin/about/testimonials/${id}/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleResponse(response);
};
