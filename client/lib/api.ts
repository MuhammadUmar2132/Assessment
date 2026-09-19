import { HistoryItem, SearchResultItem, Site, UserPersona } from '../types/browser';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function resolveSite(address: string): Promise<Site> {
  const cleanAddress = encodeURIComponent(address.trim().replace(/^\/+|\/+$/g, ''));
  const res = await fetch(`${API_BASE}/sites/resolve?address=${cleanAddress}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      const err = new Error('Site not found');
      (err as any).status = 404;
      throw err;
    }
    throw new Error(`Failed to resolve site: ${res.statusText}`);
  }

  return res.json();
}

export async function searchSites(query: string): Promise<{ results: SearchResultItem[]; total: number; query: string }> {
  if (!query.trim()) return { results: [], total: 0, query: '' };
  const res = await fetch(`${API_BASE}/sites/search?q=${encodeURIComponent(query)}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Search request failed');
  return res.json();
}

export async function publishSite(site: { address: string; title: string; content: string; author: string }): Promise<Site> {
  const res = await fetch(`${API_BASE}/sites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(site),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to publish site');
  }
  return res.json();
}

export async function fetchUsers(): Promise<UserPersona[]> {
  const res = await fetch(`${API_BASE}/users`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch user personas');
  return res.json();
}

export async function fetchUserHistory(userId: string): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/history/${encodeURIComponent(userId)}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function recordVisit(entry: { userId: string; address: string; title: string; scrollY?: number }): Promise<void> {
  try {
    await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch (err) {
    console.warn('Could not record visit to history:', err);
  }
}

export async function updateScrollOffset(userId: string, address: string, scrollY: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/history/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address, scrollY }),
    });
  } catch (err) {
    console.warn('Could not update scroll offset:', err);
  }
}

export async function clearHistory(userId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/history/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Could not clear history:', err);
  }
}

export async function fetchAllSites(limit = 100): Promise<{ sites: Site[]; total: number }> {
  const res = await fetch(`${API_BASE}/sites/list?limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) return { sites: [], total: 0 };
  return res.json();
}

