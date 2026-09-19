import React from 'react';
import { ArrowLeft, Compass, FilePlus2, Search } from 'lucide-react';

interface Props {
  address: string;
  onGoBack: () => void;
  onGoHome: () => void;
  onOpenSearch: (term?: string) => void;
  onPublishAddress: (address: string) => void;
}

export const NowhereView: React.FC<Props> = ({
  address,
  onGoBack,
  onGoHome,
  onOpenSearch,
  onPublishAddress,
}) => {
  return (
    <div className="flex-1 h-full flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-2xl p-8 border border-rose-200 shadow-xl shadow-rose-50/50 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-5 text-rose-600 font-mono text-2xl font-bold">
          05
        </div>

        <div className="inline-block px-3 py-1 bg-rose-100/70 border border-rose-200 text-rose-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
          State: Nowhere
        </div>

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
          No Such Address Exists
        </h1>

        <div className="my-4 p-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-mono text-sm break-all">
          <span className="text-slate-400 select-none">smallweb://</span>
          <span className="text-rose-600 font-semibold">{address}</span>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          You followed a link or typed an address that hasn't been written yet, or has been lost to the digital void.
          In the Small Web, broken links don't crash your browser — they give you space to explore or create.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={onGoBack}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition"
          >
            <Compass className="w-4 h-4" />
            <span>Welcome Portal</span>
          </button>

          <button
            onClick={() => onOpenSearch(address)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-sm font-medium transition"
          >
            <Search className="w-4 h-4" />
            <span>Search the Web</span>
          </button>

          <button
            onClick={() => onPublishAddress(address)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Publish This Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

