const API_BASE_URL = 'https://slides-markdown.vercel.app/';

export async function fetchSlides() {
  const response = await fetch(`${API_BASE_URL}/slides`);
  if (!response.ok) {
    throw new Error('Failed to fetch slides');
  }
  return response.json();
}

export async function createSlide(slide) {
  const response = await fetch(`${API_BASE_URL}/slides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order: slide.order || 0,
      content: slide.content,
      layout: slide.layout,
      metadata: slide.metadata
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create slide');
  }
  return response.json();
}

export async function updateSlide(id, slide) {
  const response = await fetch(`${API_BASE_URL}/slides/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order: slide.order || 0,
      content: slide.content,
      layout: slide.layout,
      metadata: slide.metadata
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update slide');
  }
  return response.json();
}

export async function deleteSlide(id) {
  const response = await fetch(`${API_BASE_URL}/slides/${id}`, {
    method: 'DELETE',
  });
  
  if (response.status === 204) {
    return { success: true };
  }
  
  if (!response.ok) {
    throw new Error('Failed to delete slide');
  }
  
  try {
    return await response.json();
  } catch {
    return { success: true };
  }
} 
