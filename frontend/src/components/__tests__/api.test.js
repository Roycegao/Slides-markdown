import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchSlides, createSlide, updateSlide, deleteSlide } from '../../services/api';


function mockFetch(response, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => response,
  });
}

describe('api.js', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchSlides', () => {
    it('returns slides on success', async () => {
      const slides = [{ id: 1 }];
      vi.stubGlobal('fetch', mockFetch(slides));
      const result = await fetchSlides();
      expect(result).toEqual(slides);
    });
    it('throws on failure', async () => {
      vi.stubGlobal('fetch', mockFetch({}, false));
      await expect(fetchSlides()).rejects.toThrow('Failed to fetch slides');
    });
  });

  describe('createSlide', () => {
    it('returns created slide on success', async () => {
      const slide = { id: 2 };
      vi.stubGlobal('fetch', mockFetch(slide));
      const result = await createSlide({ content: 'c', layout: 'l', metadata: {} });
      expect(result).toEqual(slide);
    });
    it('throws on failure', async () => {
      vi.stubGlobal('fetch', mockFetch({}, false));
      await expect(createSlide({ content: 'c', layout: 'l', metadata: {} })).rejects.toThrow('Failed to create slide');
    });
  });

  describe('updateSlide', () => {
    it('returns updated slide on success', async () => {
      const slide = { id: 3 };
      vi.stubGlobal('fetch', mockFetch(slide));
      const result = await updateSlide(3, { content: 'c', layout: 'l', metadata: {} });
      expect(result).toEqual(slide);
    });
    it('throws on failure', async () => {
      vi.stubGlobal('fetch', mockFetch({}, false));
      await expect(updateSlide(3, { content: 'c', layout: 'l', metadata: {} })).rejects.toThrow('Failed to update slide');
    });
  });

  describe('deleteSlide', () => {
    it('returns success true on 204', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => { throw new Error('no body'); } }));
      const result = await deleteSlide(4);
      expect(result).toEqual({ success: true });
    });
    it('throws on failure (not ok)', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({}) }));
      await expect(deleteSlide(4)).rejects.toThrow('Failed to delete slide');
    });
    it('returns json if present', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ deleted: true }) }));
      const result = await deleteSlide(5);
      expect(result).toEqual({ deleted: true });
    });
    it('returns { success: true } if json throws', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => { throw new Error('no json'); } }));
      const result = await deleteSlide(6);
      expect(result).toEqual({ success: true });
    });
  });
}); 