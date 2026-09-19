'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { HistoryItem, LifecycleState, NavEntry, Site, UserPersona } from '../types/browser';
import {
  clearHistory,
  fetchAllSites,
  fetchUserHistory,
  fetchUsers,
  recordVisit,
  resolveSite,
  updateScrollOffset,
} from '../lib/api';
import { BrowserChrome } from '../components/BrowserChrome';
import { BrowserViewport } from '../components/BrowserViewport';
import { NowhereView } from '../components/NowhereView';
import { HistoryDrawer } from '../components/HistoryDrawer';
import { SearchModal } from '../components/SearchModal';
import { PublishModal } from '../components/PublishModal';
import { LifecycleLegend } from '../components/LifecycleLegend';

const DEFAULT_PERSONAS: UserPersona[] = [
  { username: 'Alice', avatarColor: '#f38ba8', title: 'Curious Archivist' },
  { username: 'Bob', avatarColor: '#89b4fa', title: 'Hypertext Hacker' },
  { username: 'Charlie', avatarColor: '#a6e3a1', title: 'Digital Botanist' },
  { username: 'Dana', avatarColor: '#f9e2af', title: 'Webring Navigator' },
  { username: 'Eve', avatarColor: '#cba6f7', title: 'Cybernetic Poet' },
];

export default function BrowserApp() {
  // ── Navigation History Stacks ──
  const [backStack, setBackStack] = useState<NavEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<NavEntry | null>(null);
  const [forwardStack, setForwardStack] = useState<NavEntry[]>([]);

  // ── Viewport state ──
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [lifecycleState, setLifecycleState] = useState<LifecycleState>('shown');
  const [isLoading, setIsLoading] = useState(false);
  const [nowhereAddress, setNowhereAddress] = useState<string | null>(null);

  // ── Personas ──
  const [personas, setPersonas] = useState<UserPersona[]>(DEFAULT_PERSONAS);
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(DEFAULT_PERSONAS[0]);

  // ── Modals ──
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [initialPublishAddress, setInitialPublishAddress] = useState('');

  // ── History + addresses ──
  const [dbHistory, setDbHistory] = useState<HistoryItem[]>([]);
  const [allKnownAddresses, setAllKnownAddresses] = useState<string[]>([]);

  // ── Boot: load personas and address list from API ──
  useEffect(() => {
    (async () => {
      try {
        const users = await fetchUsers();
        if (users?.length > 0) {
          setPersonas(users);
          setCurrentPersona(users[0]);
        }
      } catch { /* use defaults */ }

      try {
        const { sites } = await fetchAllSites(300);
        setAllKnownAddresses(sites.map((s) => s.address));
      } catch { /* no autocomplete */ }
    })();
  }, []);

  // ── Reload history for the active persona ──
  const reloadHistory = useCallback(async (username: string) => {
    try {
      const items = await fetchUserHistory(username);
      setDbHistory(items);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { reloadHistory(currentPersona.username); }, [currentPersona, reloadHistory]);

  // ── Core Navigation Routine ──
  const navigateToAddress = useCallback(
    async (
      rawAddress: string,
      actionType: 'push' | 'replace' | 'traverse' = 'push',
      restoreScrollY = 0
    ) => {
      const target = rawAddress.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
      if (!target) return;

      // Typed → Loading
      setLifecycleState('typed');
      await new Promise(r => setTimeout(r, 80)); // brief "typed" flash
      setLifecycleState('loading');
      setIsLoading(true);

      try {
        const site = await resolveSite(target);

        // Check if this user has been here before
        const visited = dbHistory.some(h => h.address.toLowerCase() === target);

        // Update history stacks
        if (actionType === 'push') {
          if (currentEntry) setBackStack(prev => [...prev, currentEntry]);
          setForwardStack([]); // TRUNCATE forward stack on new navigation
          setCurrentEntry({ address: target, title: site.title, timestamp: Date.now(), scrollY: 0 });
        } else if (actionType === 'replace') {
          setCurrentEntry({ address: target, title: site.title, timestamp: Date.now(), scrollY: restoreScrollY });
        }
        // 'traverse' keeps stacks as-is (already updated by caller)

        setCurrentSite(site);
        setNowhereAddress(null);
        setLifecycleState(visited ? 'history' : 'shown');

        // Record visit to DB (fire-and-forget)
        recordVisit({ userId: currentPersona.username, address: target, title: site.title, scrollY: restoreScrollY })
          .then(() => reloadHistory(currentPersona.username));

      } catch {
        // ── State 05: Nowhere ──
        setNowhereAddress(target);
        setCurrentSite(null);
        setLifecycleState('nowhere');

        if (actionType === 'push') {
          if (currentEntry) setBackStack(prev => [...prev, currentEntry]);
          setForwardStack([]);
          setCurrentEntry({ address: target, title: 'Nowhere (404)', timestamp: Date.now(), scrollY: 0 });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentEntry, dbHistory, currentPersona.username, reloadHistory]
  );

  // ── Initial load ──
  useEffect(() => {
    navigateToAddress('welcome', 'replace');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Back ──
  const handleGoBack = useCallback(() => {
    if (!backStack.length) return;
    const prev = backStack[backStack.length - 1];
    if (currentEntry) setForwardStack(f => [currentEntry, ...f]);
    setBackStack(b => b.slice(0, -1));
    setCurrentEntry(prev);
    navigateToAddress(prev.address, 'traverse', prev.scrollY || 0);
  }, [backStack, currentEntry, navigateToAddress]);

  // ── Forward ──
  const handleGoForward = useCallback(() => {
    if (!forwardStack.length) return;
    const next = forwardStack[0];
    if (currentEntry) setBackStack(b => [...b, currentEntry]);
    setForwardStack(f => f.slice(1));
    setCurrentEntry(next);
    navigateToAddress(next.address, 'traverse', next.scrollY || 0);
  }, [forwardStack, currentEntry, navigateToAddress]);

  // ── Reload ──
  const handleReload = useCallback(() => {
    if (currentEntry) navigateToAddress(currentEntry.address, 'replace', currentEntry.scrollY || 0);
  }, [currentEntry, navigateToAddress]);

  // ── Scroll tracking (Restore on Return) ──
  const handleScrollChanged = useCallback((scrollY: number) => {
    if (currentEntry) {
      currentEntry.scrollY = scrollY;
      updateScrollOffset(currentPersona.username, currentEntry.address, scrollY);
    }
  }, [currentEntry, currentPersona.username]);

  // ── Clear History ──
  const handleClearHistory = async () => {
    await clearHistory(currentPersona.username);
    setDbHistory([]);
  };

  // ── Keyboard Shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') { e.preventDefault(); setHistoryOpen(true); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); setPublishOpen(true); }
      if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); handleGoBack(); }
      if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); handleGoForward(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleGoBack, handleGoForward]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-base">
      {/* ① Browser Chrome — Address bar, nav buttons, state badge, persona picker */}
      <BrowserChrome
        address={currentEntry?.address || ''}
        onNavigate={(addr) => navigateToAddress(addr, 'push')}
        onBack={handleGoBack}
        onForward={handleGoForward}
        onReload={handleReload}
        onHome={() => navigateToAddress('welcome', 'push')}
        canGoBack={backStack.length > 0}
        canGoForward={forwardStack.length > 0}
        lifecycleState={lifecycleState}
        isLoading={isLoading}
        onOpenSearch={() => { setInitialSearchQuery(''); setSearchOpen(true); }}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenPublish={() => { setInitialPublishAddress(''); setPublishOpen(true); }}
        personas={personas}
        currentPersona={currentPersona}
        onSelectPersona={(p) => { setCurrentPersona(p); reloadHistory(p.username); }}
        allAddresses={allKnownAddresses}
      />

      {/* ② Visual Lifecycle Legend — States 01 to 05 */}
      <LifecycleLegend currentState={lifecycleState} />

      {/* ③ Main Viewport */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {lifecycleState === 'nowhere' ? (
          <NowhereView
            address={nowhereAddress || currentEntry?.address || ''}
            onGoBack={handleGoBack}
            onGoHome={() => navigateToAddress('welcome', 'push')}
            onOpenSearch={(term) => { setInitialSearchQuery(term || ''); setSearchOpen(true); }}
            onPublishAddress={(addr) => { setInitialPublishAddress(addr); setPublishOpen(true); }}
            canGoBack={backStack.length > 0}
          />
        ) : (
          <BrowserViewport
            site={currentSite}
            targetScrollY={currentEntry?.scrollY || 0}
            onNavigate={(addr) => navigateToAddress(addr, 'push')}
            onScrollChanged={handleScrollChanged}
          />
        )}
      </main>

      {/* ④ Modals & Drawers */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={dbHistory}
        currentPersona={currentPersona}
        onJumpTo={(addr) => navigateToAddress(addr, 'push')}
        onClearHistory={handleClearHistory}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectResult={(addr) => navigateToAddress(addr, 'push')}
        initialQuery={initialSearchQuery}
      />

      <PublishModal
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublished={(addr) => {
          setAllKnownAddresses(prev => prev.includes(addr) ? prev : [...prev, addr]);
          navigateToAddress(addr, 'push');
        }}
        currentPersona={currentPersona}
        initialAddress={initialPublishAddress}
      />
    </div>
  );
}
