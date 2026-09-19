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

  // Group history by date
  const grouped: Record<string, HistoryItem[]> = {};
  history.forEach(item => {
    const date = new Date(item.visitedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) label = 'Today';
    else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(item);
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-crust border-l border-surface0 flex flex-col shadow-modal animate-slide-down" style={{ animation: 'slideRight 0.2s ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-surface0 bg-mantle shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/10"
              style={{ backgroundColor: currentPersona.avatarColor }}
            >
              {currentPersona.username[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text">{currentPersona.username}'s History</h2>
              <p className="text-[10px] text-overlay0">
                {history.length} {history.length === 1 ? 'visit' : 'visits'} · Jumpable
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={() => { if (window.confirm(`Clear all history for ${currentPersona.username}?`)) onClearHistory(); }}
                title="Clear history"
                className="p-1.5 rounded-lg text-overlay0 hover:text-red hover:bg-red/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-overlay0 hover:text-text hover:bg-surface0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface0 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-overlay0" />
              </div>
              <p className="text-sm font-semibold text-subtext1">No history yet</p>
              <p className="text-xs text-overlay0 mt-1.5 leading-relaxed max-w-[200px]">
                Navigate to any page and your trail will appear here for {currentPersona.username}.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div className="sticky top-0 px-4 py-2 bg-crust/90 backdrop-blur-sm border-b border-surface0/50">
                  <span className="text-[10px] font-semibold text-overlay0 uppercase tracking-widest">{dateLabel}</span>
                </div>
                <div className="divide-y divide-surface0/30">
                  {items.map((item, idx) => {
                    const time = new Date(item.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <button
                        key={item._id || `${item.address}-${idx}`}
                        onClick={() => { onJumpTo(item.address); onClose(); }}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface0/50 group transition-colors"
                      >
                        <div className="w-6 h-6 rounded bg-surface0 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue/10 transition-colors">
                          <span className="text-[9px] font-mono text-overlay0 group-hover:text-blue">W</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium text-text truncate group-hover:text-blue transition-colors">
                            {item.title || item.address}
                          </div>
                          <div className="text-[10px] font-mono text-overlay0 truncate mt-0.5">
                            smallweb://{item.address}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[10px] font-mono text-overlay0">{time}</span>
                          <ExternalLink className="w-3 h-3 text-overlay0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-surface0 bg-mantle shrink-0">
          <p className="text-[10px] text-center text-overlay0">
            History is per-persona · Scroll positions remembered · Jumpable
          </p>
        </div>
      </div>
    </>
  );
};
