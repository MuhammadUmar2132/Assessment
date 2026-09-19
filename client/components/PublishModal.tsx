import React, { useEffect, useState } from 'react';
import { UserPersona } from '../types/browser';
import { publishSite } from '../lib/api';
import { Check, Code2, Eye, Globe, Loader2, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPublished: (address: string) => void;
  currentPersona: UserPersona;
  initialAddress?: string;
}

export const PublishModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPublished,
  currentPersona,
  initialAddress = '',
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAddress(initialAddress);
      if (!title) {
        setTitle(initialAddress ? initialAddress.replace(/[-_/]/g, ' ') : '');
      }
      if (!content) {
        setContent(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: serif; max-width: 680px; margin: 2rem auto; line-height: 1.6; color: #2d3748; }
    h1 { color: #2b6cb0; }
    a { color: #3182ce; }
  </style>
</head>
<body>
  <h1>My Handcrafted Page</h1>
  <p>Hello from the Small Web! I authored this page with plain HTML.</p>
  <p>Explore other sites: <a href="welcome">The Portal</a> or <a href="directory">Directory</a>.</p>
</body>
</html>`);
      }
    }
  }, [isOpen, initialAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !title.trim() || !content.trim()) {
      setError('Please provide address, title, and HTML content.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const cleanAddress = address.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
      await publishSite({
        address: cleanAddress,
        title: title.trim(),
        content,
        author: currentPersona.username,
      });
      onPublished(cleanAddress);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish site. Please check address format.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Publish to the Small Web
              </h2>
              <p className="text-xs text-slate-400">
                Authoring as <strong className="text-slate-700">{currentPersona.username}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
                  !previewMode ? 'bg-white text-slate-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Source</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
                  previewMode ? 'bg-white text-slate-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 flex flex-col space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Address (Slug / Path)
              </label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
                <span className="bg-slate-100 text-slate-500 px-3 py-2 text-xs font-mono flex items-center border-r border-slate-200 select-none">
                  smallweb://
                </span>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. notes/gardening"
                  className="flex-1 px-3 py-2 text-xs font-mono text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Page Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. A Living Garden of Ideas"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              HTML Document
            </label>

            {!previewMode ? (
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write raw HTML here..."
                rows={12}
                className="w-full flex-1 p-3.5 font-mono text-xs text-slate-800 bg-slate-900/5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y"
              />
            ) : (
              <div className="w-full flex-1 min-h-[250px] border border-slate-200 rounded-xl overflow-hidden bg-white">
                <iframe
                  srcDoc={content}
                  title="HTML Preview"
                  sandbox="allow-scripts"
                  className="w-full h-full border-none"
                />
              </div>
            )}
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Instant Hypertext Linking:</strong> You can link to any other page by writing standard anchors like{' '}
              <code>&lt;a href="welcome"&gt;The Portal&lt;/a&gt;</code> or{' '}
              <code>&lt;a href="encyclopedia/hypertext"&gt;Hypertext&lt;/a&gt;</code>.
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Publish Page</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
