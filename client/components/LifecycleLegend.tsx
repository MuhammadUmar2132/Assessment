import React from 'react';
import { LifecycleState } from '../types/browser';

interface Props {
  currentState: LifecycleState;
}

const states: { id: LifecycleState; num: string; label: string; desc: string; color: string; border: string; bg: string }[] = [
  {
    id: 'typed',
    num: '01',
    label: 'Typed',
    desc: 'An address, entered',
    color: 'text-teal-700',
    border: 'border-teal-500',
    bg: 'bg-teal-50',
  },
  {
    id: 'loading',
    num: '02',
    label: 'Loading',
    desc: 'Asked for, not shown',
    color: 'text-amber-700',
    border: 'border-amber-500',
    bg: 'bg-amber-50',
  },
  {
    id: 'shown',
    num: '03',
    label: 'Shown',
    desc: 'Read, and recorded',
    color: 'text-emerald-700',
    border: 'border-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    id: 'history',
    num: '04',
    label: 'In history',
    desc: 'Been here before',
    color: 'text-amber-700',
    border: 'border-amber-500',
    bg: 'bg-amber-50',
  },
  {
    id: 'nowhere',
    num: '05',
    label: 'Nowhere',
    desc: 'No such address',
    color: 'text-rose-700',
    border: 'border-rose-500',
    bg: 'bg-rose-50',
  },
];

export const LifecycleLegend: React.FC<Props> = ({ currentState }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-2 flex items-center justify-between overflow-x-auto shadow-sm">
      <div className="flex items-center space-x-6 min-w-max mx-auto">
        {states.map((st, index) => {
          const isActive = currentState === st.id;
          return (
            <React.Fragment key={st.id}>
              <div
                className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? `${st.bg} ${st.border} border-2 shadow-sm ring-2 ring-sky-200 scale-105`
                    : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${
                    isActive ? `${st.border} ${st.color} bg-white` : 'border-slate-300 text-slate-500'
                  }`}
                >
                  {st.num}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold leading-tight ${isActive ? st.color : 'text-slate-700'}`}>
                    {st.label}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    {st.desc}
                  </span>
                </div>
              </div>

              {index < states.length - 1 && (
                <div className="w-4 h-0.5 bg-slate-200 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

