import React, { useEffect, useRef, useState } from 'react';
import { SearchResultItem } from '../types/browser';
import { searchSites } from '../lib/api';
import { ArrowRight, Loader2, Search, X } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
      if (initialQuery.trim()) {
        executeSearch(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  const executeSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchSites(searchTerm);
      setResults(data.results);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-sky-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all pages by words written inside them..."
            className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden font-medium"
          />
          {loading ? (
            <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setSearched(false);
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-200/80 hover:bg-slate-300 rounded-md transition"
          >
            ESC
          </button>
        </form>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {!searched && !loading && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium text-slate-600">Full-Text Hypertext Search</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Type any keyword, phrase, or topic to search through the HTML body of every site stored in the database.
              </p>
            </div>
          )}

          {searched && results.length === 0 && !loading && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-700">No pages matched "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for words like "hypertext", "sourdough", "arcade", "manifesto", or "alice".
              </p>
            </div>
          )}

          {results.map((res) => (
            <div
              key={res.address}
              onClick={() => {
                onSelectResult(res.address);
                onClose();
              }}
              className="group p-3.5 rounded-xl border border-slate-100 hover:border-sky-300 bg-white hover:bg-sky-50/50 transition cursor-pointer flex flex-col space-y-1 shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                  {res.title || res.address}
                </span>
                <span className="text-xs font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 shrink-0 ml-2">
                  smallweb://{res.address}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {res.snippet}
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>Author: <strong className="text-slate-600 font-normal">{res.author}</strong></span>
                <span className="flex items-center space-x-1 text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  <span>Visit site</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center px-4">
            <span>Found {results.length} matching {results.length === 1 ? 'page' : 'pages'}</span>
            <span className="text-[11px] text-slate-400">MongoDB text indexing</span>
          </div>
        )}
      </div>
    </div>
  );
};
