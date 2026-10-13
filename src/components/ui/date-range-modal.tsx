import React, { useState } from 'react';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (range: string, customStart?: string, customEnd?: string, isCompare?: boolean, compareRange?: string, compCustom?: any) => void;
  currentRange: string;
}

export function DateRangeModal({ isOpen, onClose, onApply, currentRange }: DateRangeModalProps) {
  const [activeTab, setActiveTab] = useState<'filter' | 'compare'>('filter');
  
  // Set default selection based on currentRange. If it's a small range, default to 6m in the modal so something is checked.
  const [selectedFilter, setSelectedFilter] = useState(['6m', '12m', '16m', 'custom'].includes(currentRange) ? currentRange : '6m');
  const [selectedCompare, setSelectedCompare] = useState('c_3m_prev');
  
  // Basic date management for custom inputs
  const today = new Date().toISOString().split('T')[0];
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);
  
  // Compare custom dates
  const [compStart1, setCompStart1] = useState(today);
  const [compEnd1, setCompEnd1] = useState(today);
  const [compStart2, setCompStart2] = useState(today);
  const [compEnd2, setCompEnd2] = useState(today);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onClose(); }}></div>
      <div 
        className="absolute right-0 top-full mt-2 w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-sm"
        onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up to parents
      >
        
        {/* Header Tabs */}
        <div className="flex px-4 border-b border-slate-100 pt-3 gap-6">
          <button 
            className={`px-2 py-3 font-medium transition-colors border-b-2 ${activeTab === 'filter' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('filter')}
          >
            Filter
          </button>
          <button 
            className={`px-2 py-3 font-medium transition-colors border-b-2 ${activeTab === 'compare' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('compare')}
          >
            Compare
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeTab === 'filter' ? (
            <div className="space-y-4">
              {[
                { val: '6m', label: 'Last 6 months' },
                { val: '12m', label: 'Last 12 months' },
                { val: '16m', label: 'Last 16 months' },
                { val: 'custom', label: 'Custom' },
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="dateFilter" 
                    value={opt.val} 
                    checked={selectedFilter === opt.val} 
                    onChange={() => setSelectedFilter(opt.val)} 
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                  />
                  <span className="text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                </label>
              ))}
              
              {/* Custom Date Inputs */}
              <div className={`flex items-center gap-4 ml-7 mt-3 transition-opacity duration-200 ${selectedFilter === 'custom' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="border border-slate-300 rounded-md px-3 py-2 flex-1 bg-white">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Start date</span>
                  <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-full text-slate-900 outline-none bg-transparent" />
                </div>
                <span className="text-slate-400 font-medium">-</span>
                <div className="border border-slate-300 rounded-md px-3 py-2 flex-1 bg-white">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">End date</span>
                  <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-full text-slate-900 outline-none bg-transparent" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { val: 'c_3m_prev', label: 'Compare last 3 months to previous period' },
                { val: 'c_3m_yoy', label: 'Compare last 3 months year over year' },
                { val: 'c_6m_prev', label: 'Compare last 6 months to previous period' },
                { val: 'custom', label: 'Custom' },
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="dateCompare" 
                    value={opt.val} 
                    checked={selectedCompare === opt.val} 
                    onChange={() => setSelectedCompare(opt.val)} 
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                  />
                  <span className="text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                </label>
              ))}

              {/* Custom Compare Dates (vs) */}
              <div className={`flex flex-col gap-3 ml-7 mt-3 transition-opacity duration-200 ${selectedCompare === 'custom' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="flex items-center gap-4">
                  <div className="border border-slate-300 rounded-md px-3 py-2 flex-1 bg-white">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Start date</span>
                    <input type="date" value={compStart1} onChange={(e) => setCompStart1(e.target.value)} className="w-full text-slate-900 outline-none bg-transparent" />
                  </div>
                  <span className="text-slate-400 font-medium">-</span>
                  <div className="border border-slate-300 rounded-md px-3 py-2 flex-1 bg-white">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">End date</span>
                    <input type="date" value={compEnd1} onChange={(e) => setCompEnd1(e.target.value)} className="w-full text-slate-900 outline-none bg-transparent" />
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 font-medium my-1">vs.</div>
                
                <div className="flex items-center gap-4">
                  <div className="border border-slate-300 rounded-md px-3 py-2 flex-1 bg-white">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Start date</span>
                    <input type="date" value={compStart2} onChange={(e) => setCompStart2(e.target.value)} className="w-full text-slate-900 outline-none bg-transparent" />
                  </div>
                  <span className="text-slate-400 font-medium">-</span>
                  <div className="border border-slate-300 rounded-md px-3 py-2 flex-1 bg-white">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">End date</span>
                    <input type="date" value={compEnd2} onChange={(e) => setCompEnd2(e.target.value)} className="w-full text-slate-900 outline-none bg-transparent" />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-white border-t border-slate-100">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="px-5 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (activeTab === 'filter') {
                if (selectedFilter === 'custom') {
                  onApply('custom', customStart, customEnd, false);
                } else {
                  onApply(selectedFilter, undefined, undefined, false);
                }
              } else {
                if (selectedCompare === 'custom') {
                  onApply('custom', compStart1, compEnd1, true, 'custom', { start: compStart2, end: compEnd2 });
                } else {
                  onApply(selectedCompare, undefined, undefined, true, selectedCompare);
                }
              }
              onClose();
            }}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

