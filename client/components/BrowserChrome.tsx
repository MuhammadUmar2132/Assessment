import React, { useEffect, useRef, useState } from 'react';
import { LifecycleState, UserPersona } from '../types/browser';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  Compass,
  FilePlus,
  Globe,
  Loader2,
  RefreshCw,
  Search,
  User,
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
  onOpenSearch: () => void;
  onOpenHistory: () => void;
  onOpenPublish: () => void;
  personas: UserPersona[];
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  allAddresses: string[];
}

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

  // Sync input with external address changes
  useEffect(() => {
    setInputValue(address);
  }, [address]);

  // Click outside listener for persona dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setShowPersonaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNavigate(inputValue.trim());
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  // Filter auto-suggestions
  const filteredSuggestions = isFocused && inputValue.trim()
    ? allAddresses
        .filter((addr) => addr.toLowerCase().includes(inputValue.toLowerCase()) && addr !== inputValue)
        .slice(0, 6)
    : [];

  // Lifecycle badge style mapping
  const getBadgeConfig = () => {
    switch (lifecycleState) {
      case 'typed':
        return { num: '01', label: 'Typed', color: 'bg-teal-100 text-teal-800 border-teal-300' };
      case 'loading':
        return { num: '02', label: 'Loading', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'shown':
        return { num: '03', label: 'Shown', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'history':
        return { num: '04', label: 'In history', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'nowhere':
        return { num: '05', label: 'Nowhere', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  const badge = getBadgeConfig();

  return (
    <header className="bg-slate-100 border-b border-slate-300 px-3 py-2 flex flex-col space-y-1.5 select-none relative z-30 shadow-2xs">
      {/* Upper Navigation Bar */}
      <div className="flex items-center justify-between space-x-2">
        {/* Navigation Buttons: Back, Forward, Reload, Home */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            title={canGoBack ? 'Back' : 'No previous page'}
            className={`p-1.5 rounded-lg transition ${
              canGoBack
                ? 'text-slate-700 hover:bg-slate-200 active:bg-slate-300 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onForward}
            disabled={!canGoForward}
            title={canGoForward ? 'Forward' : 'No forward history'}
            className={`p-1.5 rounded-lg transition ${
              canGoForward
                ? 'text-slate-700 hover:bg-slate-200 active:bg-slate-300 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReload}
            title="Reload this page"
            className="p-1.5 text-slate-700 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition"
          >
            {lifecycleState === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onHome}
            title="Go to Welcome Portal (smallweb://welcome)"
            className="p-1.5 text-slate-700 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibar / Address Bar with Lifecycle State Badge */}
        <div className="flex-1 max-w-3xl relative">
          <form
            onSubmit={handleSubmit}
            className={`flex items-center bg-white border rounded-xl px-3 py-1.5 shadow-2xs transition ${
              isFocused
                ? 'ring-2 ring-sky-400 border-sky-400 shadow-md'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <span className="text-xs font-mono text-slate-400 mr-1.5 select-none flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>smallweb://</span>
            </span>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Type an address to visit..."
              className="flex-1 bg-transparent text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />

            {inputValue && isFocused && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setInputValue('');
                  inputRef.current?.focus();
                }}
                className="text-slate-400 hover:text-slate-600 mr-2 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Current Lifecycle State Badge inside Omnibar */}
            <div
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide shrink-0 transition-all ${badge.color}`}
            >
              <span className="font-mono">{badge.num}</span>
              <span>{badge.label}</span>
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-3 py-1 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Addresses on Small Web
              </div>
              {filteredSuggestions.map((sug) => (
                <div
                  key={sug}
                  onMouseDown={() => {
                    setInputValue(sug);
                    onNavigate(sug);
                  }}
                  className="px-3 py-2 text-xs font-mono text-slate-700 hover:bg-sky-50 hover:text-sky-700 cursor-pointer flex items-center justify-between transition"
                >
                  <span>smallweb://{sug}</span>
                  <span className="text-[10px] text-slate-400 font-sans">Jump ↵</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Persona Picker */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            title="Search Web Body Content"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white border border-slate-300 hover:border-sky-400 hover:text-sky-700 rounded-lg text-xs font-medium text-slate-700 shadow-2xs transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Search</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            title="Open Browsing History"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white border border-slate-300 hover:border-indigo-400 hover:text-indigo-700 rounded-lg text-xs font-medium text-slate-700 shadow-2xs transition"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">History</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={onOpenPublish}
            title="Publish a New Site"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publish</span>
          </button>

          {/* Persona Selector (Identity as per specification) */}
          <div className="relative" ref={personaMenuRef}>
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center space-x-1.5 px-2 py-1 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs shadow-2xs transition"
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                style={{ backgroundColor: currentPersona.avatarColor || '#3b82f6' }}
              >
                {currentPersona.username[0]?.toUpperCase()}
              </div>
              <span className="font-medium text-slate-800 text-xs hidden lg:inline">
                {currentPersona.username}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Persona Dropdown Menu */}
            {showPersonaMenu && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Persona (History Identity)
                </div>
                <div className="py-1 max-h-56 overflow-y-auto space-y-0.5">
                  {personas.map((p) => {
                    const isSelected = p.username === currentPersona.username;
                    return (
                      <button
                        key={p.username}
                        onClick={() => {
                          onSelectPersona(p);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-xs text-left transition ${
                          isSelected ? 'bg-sky-50 text-sky-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: p.avatarColor }}
                        >
                          {p.username[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 truncate">
                          <div className="leading-tight">{p.username}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate">{p.title}</div>
                        </div>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
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
