import React from 'react';
import { ArrowLeft, Compass, FilePlus2, Search, Wifi } from 'lucide-react';

interface Props {
  address: string;
  onGoBack: () => void;
  onGoHome: () => void;
  onOpenSearch: (term?: string) => void;
  onPublishAddress: (address: string) => void;
  canGoBack: boolean;
}

export const NowhereView: React.FC<Props> = ({
  address,
  onGoBack,
  onGoHome,
  onOpenSearch,
  onPublishAddress,
  canGoBack,
}) => {
  return (
    <div className="flex-1 h-full flex items-center justify-center p-8 bg-base">
      <div className="max-w-md w-full text-center animate-scale-in">
        {/* Error Code Ring */}
        <div className="relative inline-flex mb-8">
          <div className="w-28 h-28 rounded-full bg-red/5 border-2 border-red/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-red/10 border border-red/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red font-mono font-black text-xl leading-none">05</div>
                <div className="text-red/60 text-[9px] font-semibold uppercase tracking-widest mt-0.5">Nowhere</div>
              </div>
            </div>
          </div>
          {/* Decorative dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red/30" />
          <div className="absolute top-2 -right-4 w-2 h-2 rounded-full bg-red/20" />
          <div className="absolute -bottom-2 -left-3 w-2 h-2 rounded-full bg-red/15" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-text mb-2 tracking-tight">
          No Such Address Exists
        </h1>
        <p className="text-sm text-overlay1 mb-5 leading-relaxed">
          You followed a link or typed an address that hasn't been written yet in the Small Web.
          Broken links don't crash the browser — they bring you here.
        </p>

        {/* The bad address */}
        <div className="mb-7 flex items-center justify-center gap-2 px-4 py-2.5 bg-mantle border border-surface0 rounded-xl">
          <Wifi className="w-3.5 h-3.5 text-red/60 shrink-0" />
          <span className="text-[11px] font-mono text-overlay0 break-all">
            <span className="text-overlay0/60">smallweb://</span>
            <span className="text-red font-semibold">{address}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              canGoBack
                ? 'bg-surface0 hover:bg-surface1 text-text'
                : 'bg-surface0/40 text-overlay0 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-surface0 hover:bg-surface1 text-text transition-colors"
          >
            <Compass className="w-4 h-4" />
            Welcome Portal
          </button>

          <button
            onClick={() => onOpenSearch(address)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue/10 hover:bg-blue/20 text-blue border border-blue/20 hover:border-blue/40 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Web
          </button>

          <button
            onClick={() => onPublishAddress(address)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green/15 hover:bg-green/25 text-green border border-green/30 hover:border-green/50 transition-colors"
          >
            <FilePlus2 className="w-4 h-4" />
            Publish Here
          </button>
        </div>

        <p className="mt-5 text-[10px] text-overlay0">
          State 05 of 05 · Broken links are followed, not ignored
        </p>
      </div>
    </div>
  );
};
