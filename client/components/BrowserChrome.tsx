import React, { useEffect, useRef, useState } from 'react';
import { LifecycleState, UserPersona } from '../types/browser';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  Compass,
  FilePlus2,
  Globe,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

interface Props {
  address: string;
  onNavigate: (address: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  lifecycleState: LifecycleState;
  isLoading: boolean;
  onOpenSearch: () => void;
  onOpenHistory: () => void;
  onOpenPublish: () => void;
  personas: UserPersona[];
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  allAddresses: string[];
}

const stateBadge = {
  typed:   { num: '01', label: 'Typed',      bg: 'bg-teal/15',   text: 'text-teal',   border: 'border-teal/40'   },
  loading: { num: '02', label: 'Loading',    bg: 'bg-yellow/15', text: 'text-yellow', border: 'border-yellow/40' },
  shown:   { num: '03', label: 'Shown',      bg: 'bg-green/15',  text: 'text-green',  border: 'border-green/40'  },
  history: { num: '04', label: 'In history', bg: 'bg-peach/15',  text: 'text-peach',  border: 'border-peach/40'  },
  nowhere: { num: '05', label: 'Nowhere',    bg: 'bg-red/15',    text: 'text-red',    border: 'border-red/40'    },
};

export const BrowserChrome: React.FC<Props> = ({
  address,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  canGoBack,
  canGoForward,
  lifecycleState,
  isLoading,
  onOpenSearch,
  onOpenHistory,
  onOpenPublish,
  personas,
  currentPersona,
  onSelectPersona,
  allAddresses,
}) => {
  const [inputValue, setInputValue] = useState(address);
  const [isFocused, setIsFocused] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const personaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputValue(address); }, [address]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setShowPersonaMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNavigate(inputValue.trim());
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const suggestions = isFocused && inputValue.trim().length > 0
    ? allAddresses.filter(a => a.toLowerCase().includes(inputValue.toLowerCase()) && a !== inputValue).slice(0, 7)
    : [];

  const badge = stateBadge[lifecycleState];

  return (
    <header className="bg-crust border-b border-surface0 px-3 py-2.5 select-none relative z-40 shrink-0" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
      {/* Loading progress bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
          <div className="h-full bg-blue loading-bar" />
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* ── Nav Buttons ── */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            title="Back (Alt + ←)"
            className={`p-1.5 rounded-lg transition-colors ${
              canGoBack
                ? 'text-subtext1 hover:bg-surface0 hover:text-text active:bg-surface1'
                : 'text-surface1 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onForward}
            disabled={!canGoForward}
            title="Forward (Alt + →)"
            className={`p-1.5 rounded-lg transition-colors ${
              canGoForward
                ? 'text-subtext1 hover:bg-surface0 hover:text-text active:bg-surface1'
                : 'text-surface1 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReload}
            title="Reload (Ctrl + R)"
            className="p-1.5 rounded-lg text-subtext1 hover:bg-surface0 hover:text-text active:bg-surface1 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue' : ''}`} />
          </button>

          <button
            onClick={onHome}
            title="Home (smallweb://welcome)"
            className="p-1.5 rounded-lg text-subtext1 hover:bg-surface0 hover:text-text active:bg-surface1 transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-surface0 mx-1" />
        </div>

        {/* ── Omnibar ── */}
        <div className="flex-1 relative min-w-0">
          <form onSubmit={handleSubmit}>
            <div
              className={`flex items-center gap-2 bg-mantle rounded-xl px-3 py-1.5 border transition-all ${
                isFocused
                  ? 'border-blue/60 ring-2 ring-blue/20'
                  : 'border-surface0 hover:border-surface1'
              }`}
            >
              {/* Protocol prefix */}
              {!isFocused && (
                <div className="flex items-center gap-1 shrink-0">
                  <Globe className="w-3 h-3 text-overlay0" />
                  <span className="text-[10px] font-mono text-overlay0">smallweb://</span>
                </div>
              )}

              {/* Address input */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => { setIsFocused(true); inputRef.current?.select(); }}
                onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                placeholder={isFocused ? 'Type an address — e.g. welcome, garden/digital-gardening...' : address}
                className="flex-1 min-w-0 bg-transparent text-[12px] font-mono text-text placeholder-overlay0 focus:outline-none"
              />

              {/* Clear button */}
              {isFocused && inputValue && (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setInputValue(''); inputRef.current?.focus(); }}
                  className="text-overlay0 hover:text-subtext1 shrink-0 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* State badge */}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold font-mono shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.num === '02' && isLoading ? (
                  <svg className="animate-spin w-2.5 h-2.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : null}
                {badge.num} · {badge.label}
              </div>
            </div>
          </form>

          {/* ── Autocomplete Suggestions ── */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-crust border border-surface0 rounded-xl shadow-modal overflow-hidden z-50 animate-slide-down">
              <div className="px-3 py-1.5 border-b border-surface0 flex items-center gap-1.5">
                <Globe className="w-2.5 h-2.5 text-overlay0" />
                <span className="text-[9px] font-semibold text-overlay0 uppercase tracking-widest">
                  Small Web Addresses
                </span>
              </div>
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onMouseDown={() => { setInputValue(sug); onNavigate(sug); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-surface0 transition-colors group"
                >
                  <span className="text-[11px] font-mono text-subtext1 group-hover:text-text truncate">
                    <span className="text-overlay0">smallweb://</span>{sug}
                  </span>
                  <span className="text-[9px] text-overlay0 group-hover:text-blue shrink-0 ml-2">↵ Go</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search */}
          <button
            onClick={onOpenSearch}
            title="Full-text Search (Ctrl + K)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface0 hover:bg-surface1 text-subtext1 hover:text-text text-[11px] font-medium transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden lg:inline text-[9px] text-overlay0 bg-mantle px-1 py-0.5 rounded border border-surface1">⌃K</kbd>
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            title="History (Ctrl + H)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface0 hover:bg-surface1 text-subtext1 hover:text-text text-[11px] font-medium transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">History</span>
            <kbd className="hidden lg:inline text-[9px] text-overlay0 bg-mantle px-1 py-0.5 rounded border border-surface1">⌃H</kbd>
          </button>

          {/* Publish */}
          <button
            onClick={onOpenPublish}
            title="Publish a Site"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green/20 hover:bg-green/30 text-green text-[11px] font-semibold border border-green/30 hover:border-green/50 transition-colors"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>

          <div className="w-px h-4 bg-surface0 mx-0.5" />

          {/* Persona Picker */}
          <div className="relative" ref={personaMenuRef}>
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-surface0 hover:bg-surface1 transition-colors"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 ring-2 ring-white/10"
                style={{ backgroundColor: currentPersona.avatarColor }}
              >
                {currentPersona.username[0]?.toUpperCase()}
              </div>
              <span className="text-[11px] font-medium text-subtext1 hidden lg:inline max-w-[80px] truncate">
                {currentPersona.username}
              </span>
              <ChevronDown className={`w-3 h-3 text-overlay0 transition-transform ${showPersonaMenu ? 'rotate-180' : ''}`} />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-crust border border-surface0 rounded-2xl shadow-modal overflow-hidden z-50 animate-scale-in">
                <div className="px-3 py-2.5 border-b border-surface0">
                  <p className="text-[10px] font-semibold text-overlay0 uppercase tracking-widest">Switch Persona</p>
                  <p className="text-[10px] text-overlay0 mt-0.5">History belongs to the selected user</p>
                </div>
                <div className="py-1.5 max-h-64 overflow-y-auto">
                  {personas.map((p) => {
                    const isSelected = p.username === currentPersona.username;
                    return (
                      <button
                        key={p.username}
                        onClick={() => { onSelectPersona(p); setShowPersonaMenu(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          isSelected ? 'bg-blue/10' : 'hover:bg-surface0'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: p.avatarColor, boxShadow: `0 0 0 2px ${p.avatarColor}50` }}
                        >
                          {p.username[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[12px] font-semibold truncate ${isSelected ? 'text-blue' : 'text-text'}`}>
                            {p.username}
                          </div>
                          <div className="text-[10px] text-overlay0 truncate">{p.title}</div>
                        </div>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
