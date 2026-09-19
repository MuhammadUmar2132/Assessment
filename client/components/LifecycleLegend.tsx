import React from 'react';
import { LifecycleState } from '../types/browser';

interface Props {
  currentState: LifecycleState;
}

const states: {
  id: LifecycleState;
  num: string;
  label: string;
  desc: string;
  activeRing: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
  dotColor: string;
}[] = [
  {
    id: 'typed',
    num: '01',
    label: 'Typed',
    desc: 'An address, entered',
    activeRing: 'ring-teal/40',
    activeBg: 'bg-teal/10',
    activeText: 'text-teal',
    activeBorder: 'border-teal/50',
    dotColor: 'bg-teal',
  },
  {
    id: 'loading',
    num: '02',
    label: 'Loading',
    desc: 'Asked for, not shown',
    activeRing: 'ring-yellow/40',
    activeBg: 'bg-yellow/10',
    activeText: 'text-yellow',
    activeBorder: 'border-yellow/50',
    dotColor: 'bg-yellow',
  },
  {
    id: 'shown',
    num: '03',
    label: 'Shown',
    desc: 'Read, and recorded',
    activeRing: 'ring-green/40',
    activeBg: 'bg-green/10',
    activeText: 'text-green',
    activeBorder: 'border-green/50',
    dotColor: 'bg-green',
  },
  {
    id: 'history',
    num: '04',
    label: 'In history',
    desc: 'Been here before',
    activeRing: 'ring-peach/40',
    activeBg: 'bg-peach/10',
    activeText: 'text-peach',
    activeBorder: 'border-peach/50',
    dotColor: 'bg-peach',
  },
  {
    id: 'nowhere',
    num: '05',
    label: 'Nowhere',
    desc: 'No such address',
    activeRing: 'ring-red/40',
    activeBg: 'bg-red/10',
    activeText: 'text-red',
    activeBorder: 'border-red/50',
    dotColor: 'bg-red',
  },
];

export const LifecycleLegend: React.FC<Props> = ({ currentState }) => {
  return (
    <div className="bg-mantle border-b border-surface0 px-4 py-2 flex items-center justify-center overflow-x-auto shrink-0">
      <div className="flex items-center gap-1 min-w-max">
        {states.map((st, index) => {
          const isActive = currentState === st.id;
          const isPast = states.findIndex(s => s.id === currentState) > index;

          return (
            <React.Fragment key={st.id}>
              {/* State Node */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? `${st.activeBg} ${st.activeBorder} ring-2 ${st.activeRing} scale-105`
                    : isPast
                    ? 'bg-surface0/30 border-surface1/30 opacity-50'
                    : 'bg-transparent border-transparent opacity-25 grayscale'
                }`}
              >
                {/* Circle number */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                    isActive
                      ? `${st.activeBg} ${st.activeBorder} ${st.activeText} ${isActive && st.id === 'loading' ? 'pulse-loading' : ''}`
                      : 'border-surface1 text-overlay0'
                  }`}
                >
                  {isActive && st.id === 'loading' ? (
                    <svg className="animate-spin w-2.5 h-2.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    st.num
                  )}
                </div>

                {/* Label */}
                <div className="flex flex-col leading-none">
                  <span className={`text-[11px] font-semibold ${isActive ? st.activeText : 'text-subtext0'}`}>
                    {st.label}
                  </span>
                  <span className="text-[9px] text-overlay0 font-normal">
                    {st.desc}
                  </span>
                </div>

                {/* Active dot indicator */}
                {isActive && (
                  <div className={`w-1.5 h-1.5 rounded-full ${st.dotColor} ${st.id === 'loading' ? 'animate-pulse' : ''}`} />
                )}
              </div>

              {/* Connector line */}
              {index < states.length - 1 && (
                <div
                  className={`w-5 h-px transition-colors duration-300 hidden sm:block ${
                    isPast || isActive ? 'bg-surface2' : 'bg-surface0'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
