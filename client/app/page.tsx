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
  { username: 'Alice', avatarColor: '#ec4899', title: 'Curious Archivist' },
  { username: 'Bob', avatarColor: '#3b82f6', title: 'Hypertext Hacker' },
  { username: 'Charlie', avatarColor: '#10b981', title: 'Digital Botanist' },
  { username: 'Dana', avatarColor: '#f59e0b', title: 'Webring Navigator' },
  { username: 'Eve', avatarColor: '#8b5cf6', title: 'Cybernetic Poet' },
];

export default function BrowserApp() {
  // Navigation Stacks (The exact browser history stack machine)
  const [backStack, setBackStack] = useState<NavEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<NavEntry | null>(null);
  const [forwardStack, setForwardStack] = useState<NavEntry[]>([]);

  // Current Viewport Data
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [lifecycleState, setLifecycleState] = useState<LifecycleState>('shown');
  const [nowhereAddress, setNowhereAddress] = useState<string | null>(null);

  // Identity / Persona
  const [personas, setPersonas] = useState<UserPersona[]>(DEFAULT_PERSONAS);
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(DEFAULT_PERSONAS[0]);

  // Modals & Drawers
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [initialPublishAddress, setInitialPublishAddress] = useState('');

  // Per-person browsing history from database
  const [dbHistory, setDbHistory] = useState<HistoryItem[]>([]);
  // Autocomplete addresses
  const [allKnownAddresses, setAllKnownAddresses] = useState<string[]>([]);

  // Load initial personas and site list
  useEffect(() => {
    async function initData() {
      try {
        const users = await fetchUsers();
        if (users && users.length > 0) {
          setPersonas(users);
          setCurrentPersona(users[0]);
        }
      } catch (e) {
        console.warn('Using default personas:', e);
      }

      try {
        const { sites } = await fetchAllSites(250);
        setAllKnownAddresses(sites.map((s) => s.address));
      } catch (e) {
        console.warn('Failed to load known addresses:', e);
      }
    }

    initData();
  }, []);

  // Reload history when active persona changes
  const reloadHistory = useCallback(async (username: string) => {
    try {
      const items = await fetchUserHistory(username);
      setDbHistory(items);
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  }, []);

  useEffect(() => {
    reloadHistory(currentPersona.username);
  }, [currentPersona, reloadHistory]);

  // The Core Navigation Routine
  const navigateToAddress = useCallback(
    async (rawAddress: string, actionType: 'push' | 'replace' | 'traverse' = 'push', restoreScrollY = 0) => {
      const targetAddress = rawAddress.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
      if (!targetAddress) return;

      // 1. Enter "Typed" state
      setLifecycleState('typed');

      // 2. Enter "Loading" state
      setLifecycleState('loading');

      try {
        const site = await resolveSite(targetAddress);

        // Check if user has been here before in history
        const hasBeenHere = dbHistory.some(
          (h) => h.address.toLowerCase() === targetAddress
        );

        // Update history stacks according to browser stack semantics
        if (actionType === 'push') {
          if (currentEntry) {
            setBackStack((prev) => [...prev, currentEntry]);
          }
          // RULE: Navigating to a new address CLEAR/TRUNCATES the forward stack!
          setForwardStack([]);
          setCurrentEntry({
            address: targetAddress,
            title: site.title,
            timestamp: Date.now(),
            scrollY: 0,
          });
        } else if (actionType === 'replace') {
          setCurrentEntry({
            address: targetAddress,
            title: site.title,
            timestamp: Date.now(),
            scrollY: restoreScrollY,
          });
        }

        // Set site content & clear nowhere
        setCurrentSite(site);
        setNowhereAddress(null);

        // 3. Transition to "Shown" or "In History" state
        setLifecycleState(hasBeenHere ? 'history' : 'shown');

        // Record visit in database for this persona
        await recordVisit({
          userId: currentPersona.username,
          address: targetAddress,
          title: site.title,
          scrollY: restoreScrollY,
        });

        // Refresh per-person history
        reloadHistory(currentPersona.username);
      } catch (err: any) {
        // Address not found -> 05 Nowhere state!
        console.warn(`Address "${targetAddress}" does not exist on Small Web.`);
        setNowhereAddress(targetAddress);
        setCurrentSite(null);
        setLifecycleState('nowhere');

        if (actionType === 'push') {
          if (currentEntry) {
            setBackStack((prev) => [...prev, currentEntry]);
          }
          setForwardStack([]);
          setCurrentEntry({
            address: targetAddress,
            title: 'Nowhere (404)',
            timestamp: Date.now(),
            scrollY: 0,
          });
        }
      }
    },
    [currentEntry, dbHistory, currentPersona.username, reloadHistory]
  );

  // Initial load: navigate to "welcome" portal
  useEffect(() => {
    navigateToAddress('welcome', 'replace');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back Button Navigation
  const handleGoBack = useCallback(() => {
    if (backStack.length === 0) return;

    const previousEntry = backStack[backStack.length - 1];
    const newBackStack = backStack.slice(0, backStack.length - 1);

    if (currentEntry) {
      setForwardStack((prev) => [currentEntry, ...prev]);
    }

    setBackStack(newBackStack);
    setCurrentEntry(previousEntry);

    // "Restore on return": Navigate with restoreScrollY parameter
    navigateToAddress(previousEntry.address, 'traverse', previousEntry.scrollY || 0);
  }, [backStack, currentEntry, navigateToAddress]);

  // Forward Button Navigation
  const handleGoForward = useCallback(() => {
    if (forwardStack.length === 0) return;

    const nextEntry = forwardStack[0];
    const newForwardStack = forwardStack.slice(1);

    if (currentEntry) {
      setBackStack((prev) => [...prev, currentEntry]);
    }

    setForwardStack(newForwardStack);
    setCurrentEntry(nextEntry);

    // Restore scroll position
    navigateToAddress(nextEntry.address, 'traverse', nextEntry.scrollY || 0);
  }, [forwardStack, currentEntry, navigateToAddress]);

  // Reload Current Page
  const handleReload = useCallback(() => {
    if (currentEntry) {
      navigateToAddress(currentEntry.address, 'replace', currentEntry.scrollY || 0);
    }
  }, [currentEntry, navigateToAddress]);

  // Home Button
  const handleHome = useCallback(() => {
    navigateToAddress('welcome', 'push');
  }, [navigateToAddress]);

  // Track scrolling inside viewport for "Restore on Return"
  const handleScrollChanged = useCallback(
    (scrollY: number) => {
      if (currentEntry) {
        currentEntry.scrollY = scrollY;
        updateScrollOffset(currentPersona.username, currentEntry.address, scrollY);
      }
    },
    [currentEntry, currentPersona.username]
  );

  // Clear History
  const handleClearHistory = async () => {
    await clearHistory(currentPersona.username);
    setDbHistory([]);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K for search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Ctrl+H for history
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setHistoryOpen(true);
      }
      // Alt+Left for back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleGoBack();
      }
      // Alt+Right for forward
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleGoForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoBack, handleGoForward]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900">
      {/* 1. The Browser Chrome (Controls, Omnibar, State Pill, Persona Picker) */}
      <BrowserChrome
        address={currentEntry?.address || ''}
        onNavigate={(addr) => navigateToAddress(addr, 'push')}
        onBack={handleGoBack}
        onForward={handleGoForward}
        onReload={handleReload}
        onHome={handleHome}
        canGoBack={backStack.length > 0}
        canGoForward={forwardStack.length > 0}
        lifecycleState={lifecycleState}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenPublish={() => {
          setInitialPublishAddress('');
          setPublishOpen(true);
        }}
        personas={personas}
        currentPersona={currentPersona}
        onSelectPersona={(persona) => {
          setCurrentPersona(persona);
          // Switch history view
          reloadHistory(persona.username);
        }}
        allAddresses={allKnownAddresses}
      />

      {/* 2. Visual Lifecycle States Legend (Displays States 01 to 05) */}
      <LifecycleLegend currentState={lifecycleState} />

      {/* 3. The Browser Viewport */}
      <main className="flex-1 w-full relative bg-slate-100 flex flex-col overflow-hidden">
        {lifecycleState === 'nowhere' ? (
          <NowhereView
            address={nowhereAddress || currentEntry?.address || 'unknown'}
            onGoBack={handleGoBack}
            onGoHome={handleHome}
            onOpenSearch={(term) => {
              setInitialSearchQuery(term || '');
              setSearchOpen(true);
            }}
            onPublishAddress={(addr) => {
              setInitialPublishAddress(addr);
              setPublishOpen(true);
            }}
          />
        ) : (
          <BrowserViewport
            site={currentSite}
            targetScrollY={currentEntry?.scrollY || 0}
            onNavigate={(target) => navigateToAddress(target, 'push')}
            onScrollChanged={handleScrollChanged}
          />
        )}
      </main>

      {/* 4. Modals & Drawers */}
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
          setAllKnownAddresses((prev) => (prev.includes(addr) ? prev : [...prev, addr]));
          navigateToAddress(addr, 'push');
        }}
        currentPersona={currentPersona}
        initialAddress={initialPublishAddress}
      />
    </div>
  );
}
