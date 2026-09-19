import React, { useEffect, useRef, useState } from 'react';
import { SearchResultItem } from '../types/browser';
import { searchSites } from '../lib/api';
import { ArrowRight, Search, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (address: string) => void;
  initialQuery?: string;
}

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectResult,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setResults([]);
      setSearched(false);
      setTimeout(() => inputRef.current?.focus(), 50);
      if (initialQuery.trim()) performSearch(initialQuery);
    }
  }, [isOpen, initialQuery]);

  // Debounced live search
  useEffect(() => {
    if (!isOpen) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setSearched(false); setLoading(false); return; }
    debounceRef.current = setTimeout(() => performSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, isOpen]);

  const performSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchSites(term);
      setResults(data.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow/30 text-text rounded-sm px-0.5">$1</mark>');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-scale-in">
        <div className="bg-crust border border-surface0 rounded-2xl shadow-modal overflow-hidden" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-surface0 bg-mantle">
            {loading ? (
              <svg className="animate-spin w-4 h-4 text-blue shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <Search className="w-4 h-4 text-overlay0 shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages by what is written inside them..."
              className="flex-1 bg-transparent text-sm text-text placeholder-overlay0 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus(); }}
                className="text-overlay0 hover:text-subtext1 p-0.5 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[10px] font-semibold text-overlay0 bg-surface0 hover:bg-surface1 px-2 py-1 rounded-md border border-surface1 shrink-0 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
            {!searched && !loading && (
              <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-surface0 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-overlay0" />
                </div>
                <p className="text-sm font-semibold text-subtext1">Full-Text Hypertext Search</p>
                <p className="text-xs text-overlay0 mt-1.5 max-w-xs leading-relaxed">
                  Search inside the HTML body of every page — not just titles.
                  Try "sourdough", "hypertext", "arcade", or "manifesto".
                </p>
              </div>
            )}

            {searched && results.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                <p className="text-sm font-semibold text-subtext1">No matches for "{query}"</p>
                <p className="text-xs text-overlay0 mt-1.5">
                  Try different keywords or publish a page containing this topic.
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="divide-y divide-surface0/40 py-1">
                {results.map((result) => (
                  <button
                    key={result.address}
                    onClick={() => { onSelectResult(result.address); onClose(); }}
                    className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-surface0/60 group transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg bg-surface0 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue/10 group-hover:border group-hover:border-blue/20 transition-all">
                      <span className="text-[10px] font-mono font-bold text-overlay0 group-hover:text-blue">W</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title & Address */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className="text-[13px] font-semibold text-text group-hover:text-blue truncate transition-colors"
                          dangerouslySetInnerHTML={{ __html: highlightText(result.title || result.address, query) }}
                        />
                        <span className="text-[10px] font-mono text-overlay0 bg-surface0 px-2 py-0.5 rounded-md shrink-0">
                          {result.address}
                        </span>
                      </div>

                      {/* Snippet */}
                      <p
                        className="text-[11px] text-overlay1 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: highlightText(result.snippet, query) }}
                      />

                      {/* Meta */}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-overlay0">
                          By <span className="text-subtext0">{result.author}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-blue opacity-0 group-hover:opacity-100 transition-opacity">
                          Visit <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-surface0 bg-mantle">
              <span className="text-[10px] text-overlay0">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
              <span className="text-[10px] text-overlay0">MongoDB full-text index · Body content search</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
