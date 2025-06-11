import { describe, it, expect, vi } from 'vitest';

import * as api from '../../../services/api';

describe('api', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('fetchSlides works', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 1 }]) });
    const slides = await api.fetchSlides();
    expect(slides).toEqual([{ id: 1 }]);
  });
  it('fetchSlides error', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(api.fetchSlides()).rejects.toThrow();
  });
  it('createSlide works', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 1 }) });
    const slide = await api.createSlide({});
    expect(slide).toEqual({ id: 1 });
  });
  it('createSlide error', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(api.createSlide({})).rejects.toThrow();
  });
  it('updateSlide works', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 1 }) });
    const slide = await api.updateSlide(1, {});
    expect(slide).toEqual({ id: 1 });
  });
  it('updateSlide error', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(api.updateSlide(1, {})).rejects.toThrow();
  });
  it('deleteSlide works (204)', async () => {
    fetch.mockResolvedValueOnce({ status: 204, ok: true, json: () => Promise.resolve({}) });
    const res = await api.deleteSlide(1);
    expect(res).toEqual({ success: true });
  });
  it('deleteSlide works (json)', async () => {
    fetch.mockResolvedValueOnce({ status: 200, ok: true, json: () => Promise.resolve({ ok: true }) });
    const res = await api.deleteSlide(1);
    expect(res).toEqual({ ok: true });
  });
  it('deleteSlide error', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve({}) });
    await expect(api.deleteSlide(1)).rejects.toThrow();
  });
}); 