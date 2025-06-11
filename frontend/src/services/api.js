const API_BASE_URL = 'http://localhost:4000';

// Mock data for development/testing
const mockSlides = [
  {
    id: '1',
    title: 'Welcome',
    content: '# Welcome\n\nThis is your first slide. Start editing to create amazing presentations!',
    layout: 'default',
    metadata: {},
    order: 0
  },
  {
    id: '2', 
    title: 'Getting Started',
    content: '# Getting Started\n\n## Features\n\n- **Markdown Support**: Write in Markdown\n- **Real-time Preview**: See changes instantly\n- **Responsive Design**: Works on all devices\n- **Keyboard Shortcuts**: Navigate efficiently',
    layout: 'default',
    metadata: {},
    order: 1
  }
];

// Check if we're in development mode and API is not available
async function isApiAvailable() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('API not available, using mock data:', error.message);
    return false;
  }
}

// Use mock data if API is not available
let useMockData = false;

export async function fetchSlides() {
  // Check API availability only once
  if (useMockData === false) {
    useMockData = !(await isApiAvailable());
  }
  
  if (useMockData) {
    // Return mock data with a small delay to simulate network
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockSlides];
  }
  
  const response = await fetch(`${API_BASE_URL}/slides`);
  if (!response.ok) {
    throw new Error('Failed to fetch slides');
  }
  return response.json();
}

export async function createSlide(slide) {
  if (useMockData) {
    const newSlide = {
      ...slide,
      id: Date.now().toString(),
      title: slide.title || 'New Slide'
    };
    mockSlides.push(newSlide);
    await new Promise(resolve => setTimeout(resolve, 100));
    return newSlide;
  }
  
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
  if (useMockData) {
    const index = mockSlides.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSlides[index] = { ...mockSlides[index], ...slide };
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockSlides[index];
    }
    throw new Error('Slide not found');
  }
  
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
  if (useMockData) {
    const index = mockSlides.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSlides.splice(index, 1);
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true };
    }
    throw new Error('Slide not found');
  }
  
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
