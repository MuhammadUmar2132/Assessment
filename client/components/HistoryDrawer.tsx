import React from 'react';
import { HistoryItem, UserPersona } from '../types/browser';
import { Clock, ExternalLink, Trash2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  currentPersona: UserPersona;
  onJumpTo: (address: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  history,
  currentPersona,
  onJumpTo,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs"
              style={{ backgroundColor: currentPersona.avatarColor || '#3b82f6' }}
            >
              {currentPersona.username[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {currentPersona.username}'s History
              </h2>
              <p className="text-xs text-slate-400">
                {history.length} {history.length === 1 ? 'place' : 'places'} visited
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Clear all history"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Clock className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium text-sm text-slate-600">No browsing history yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                As you navigate pages or follow links, your chronological trail for {currentPersona.username} will appear here.
              </p>
            </div>
          ) : (
            history.map((item, idx) => {
              const timeFormatted = new Date(item.visitedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item._id || `${item.address}-${idx}`}
                  onClick={() => {
                    onJumpTo(item.address);
                    onClose();
                  }}
                  className="group p-3 rounded-xl border border-slate-100 hover:border-sky-200 bg-white hover:bg-sky-50/60 transition cursor-pointer flex items-start justify-between space-x-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-800 group-hover:text-sky-700 truncate">
                      {item.title || item.address}
                    </div>
                    <div className="text-xs font-mono text-slate-400 group-hover:text-sky-600 truncate mt-0.5">
                      smallweb://{item.address}
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 text-slate-400 space-y-1">
                    <span className="text-[11px] font-mono">{timeFormatted}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          Jumpable navigation • Scroll positions remembered
        </div>
      </div>
    </div>
  );
};

