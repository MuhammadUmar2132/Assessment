import React, { useEffect, useState } from 'react';
import { UserPersona } from '../types/browser';
import { publishSite } from '../lib/api';
import { Check, Code2, Eye, Globe, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPublished: (address: string) => void;
  currentPersona: UserPersona;
  initialAddress?: string;
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Georgia, serif;
      max-width: 680px;
      margin: 3rem auto;
      padding: 0 1.5rem;
      line-height: 1.75;
      color: #1a1a2e;
      background: #fefefe;
    }
    h1 { color: #16213e; font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #4a4a6a; }
    a { color: #0284c7; text-decoration: underline; }
    a:hover { color: #0369a1; }
    blockquote {
      border-left: 3px solid #0284c7;
      margin: 1.5rem 0;
      padding-left: 1rem;
      color: #555;
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1>My Handcrafted Page</h1>
  <p>Welcome to my little corner of the Small Web. Written by hand, stored in MongoDB.</p>
  <blockquote>
    "The web was designed to be decentralized, interconnected, and readable by everyone."
  </blockquote>
  <p>
    Explore more:
    <a href="welcome">The Portal</a> ·
    <a href="directory">Directory</a> ·
    <a href="garden/digital-gardening">Digital Gardens</a>
  </p>
</body>
</html>`;

export const PublishModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPublished,
  currentPersona,
  initialAddress = '',
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(DEFAULT_HTML);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAddress(initialAddress);
      setTitle(initialAddress ? initialAddress.replace(/[-_/]/g, ' ') : '');
      setContent(DEFAULT_HTML);
      setPreviewMode(false);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, initialAddress]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !title.trim() || !content.trim()) {
      setError('Please fill in all fields: address, title, and HTML content.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cleanAddress = address.trim().replace(/^\/+|\/+$/g, '').toLowerCase().replace(/\s+/g, '-');
      await publishSite({
        address: cleanAddress,
        title: title.trim(),
        content,
        author: currentPersona.username,
      });
      setSuccess(true);
      setTimeout(() => {
        onPublished(cleanAddress);
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to publish. Check the address format (letters, numbers, hyphens, slashes).');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center animate-scale-in">
        <div
          className="w-full max-w-3xl bg-crust border border-surface0 rounded-2xl shadow-modal flex flex-col"
          style={{ maxHeight: 'calc(100vh - 4rem)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface0 bg-mantle rounded-t-2xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green/15 border border-green/30 flex items-center justify-center">
                <Globe className="w-4 h-4 text-green" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-text">Publish to the Small Web</h2>
                <p className="text-[10px] text-overlay0">
                  Authoring as <span className="text-subtext1 font-medium">{currentPersona.username}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Source / Preview Toggle */}
              <div className="flex bg-surface0 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    !previewMode ? 'bg-mantle text-text shadow-sm' : 'text-overlay0 hover:text-subtext1'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  Source
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    previewMode ? 'bg-mantle text-text shadow-sm' : 'text-overlay0 hover:text-subtext1'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-overlay0 hover:text-text hover:bg-surface0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col p-5 gap-4">
            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-red/10 border border-red/20 text-red text-xs">
                {error}
              </div>
            )}

            {/* Address + Title Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-overlay0 uppercase tracking-widest mb-1.5">
                  Address Slug
                </label>
                <div className="flex items-center rounded-xl border border-surface0 bg-mantle overflow-hidden focus-within:border-blue/50 focus-within:ring-2 focus-within:ring-blue/20 transition-all">
                  <span className="px-3 py-2 text-[10px] font-mono text-overlay0 border-r border-surface0 bg-surface0/50 shrink-0 select-none whitespace-nowrap">
                    smallweb://
                  </span>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9\-_/]/g, '-'))}
                    placeholder="my-page or notes/ideas"
                    className="flex-1 px-3 py-2 text-[12px] font-mono text-text bg-transparent focus:outline-none placeholder-overlay0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-overlay0 uppercase tracking-widest mb-1.5">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. A Garden of Living Ideas"
                  className="w-full px-3 py-2 text-[12px] text-text bg-mantle border border-surface0 rounded-xl focus:outline-none focus:border-blue/50 focus:ring-2 focus:ring-blue/20 placeholder-overlay0 transition-all"
                />
              </div>
            </div>

            {/* Editor / Preview */}
            <div className="flex-1 flex flex-col min-h-[280px]">
              <label className="block text-[10px] font-semibold text-overlay0 uppercase tracking-widest mb-1.5">
                HTML Document
              </label>

              {previewMode ? (
                <div className="flex-1 rounded-xl overflow-hidden border border-surface0 bg-white min-h-[280px]">
                  <iframe
                    srcDoc={content}
                    title="Preview"
                    sandbox="allow-scripts"
                    className="w-full h-full min-h-[280px] border-none"
                  />
                </div>
              ) : (
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="flex-1 px-4 py-3 text-[11px] font-mono text-green bg-[#0d1117] border border-surface0 rounded-xl focus:outline-none focus:border-blue/40 focus:ring-2 focus:ring-blue/20 resize-none placeholder-overlay0 transition-all leading-relaxed"
                  style={{ minHeight: 280 }}
                />
              )}
            </div>

            {/* Info Bar */}
            <div className="px-3 py-2 rounded-xl bg-blue/5 border border-blue/15 text-[10px] text-overlay1 leading-relaxed">
              <span className="text-blue font-semibold">Tip:</span>{' '}
              Use standard{' '}
              <code className="text-green bg-surface0 px-1 rounded font-mono">
                &lt;a href="welcome"&gt;
              </code>{' '}
              anchors to link to any other page.
              Links inside your page are automatically intercepted by the browser navigation system.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-overlay1 hover:bg-surface0 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  success
                    ? 'bg-green/20 text-green border border-green/30'
                    : 'bg-green/15 hover:bg-green/25 text-green border border-green/30 hover:border-green/50'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {success ? (
                  <>
                    <Check className="w-4 h-4" />
                    Published!
                  </>
                ) : loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Publish Page
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
