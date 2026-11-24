import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowLeft, Loader2, ChevronRight, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';

export default function RepairHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    api.getRepairHistory()
      .then(res => {
        setHistory(res.history || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load history');
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...Array.from(new Set(history.map(h => h.deviceId)))];

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(h => h.deviceId === filter);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-2xl bg-white border-2 border-[#103D29]/15 hover:bg-[#FFF3E5] text-[#17251D] transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-[#103D29]" />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-2 text-[#17251D]">
            <History className="w-7 h-7 text-[#103D29]" />
            Your Repair History
          </h2>
          <p className="text-sm font-medium text-[#68736A]">Past diagnoses across all your devices.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-[#103D29]" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-red-100 border-2 border-red-300 text-red-800 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="font-bold text-sm">{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl border-2 border-[#103D29]/15 bg-white shadow-editorial">
          <History className="w-16 h-16 text-[#68736A] mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-[#17251D] mb-2">No history yet</h3>
          <p className="text-sm font-medium text-[#68736A] mb-6">Run a diagnosis on a broken device to see it here.</p>
          <button 
            onClick={() => navigate('/device')}
            className="px-8 py-3.5 rounded-full bg-[#103D29] hover:bg-[#174C32] text-white font-extrabold text-sm transition-colors shadow-editorial cursor-pointer"
          >
            Start Diagnosis
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    filter === cat 
                      ? 'bg-[#103D29] text-white shadow-sm' 
                      : 'bg-white text-[#17251D] hover:bg-[#FFF3E5] border-2 border-[#103D29]/15'
                  }`}
                >
                  {cat === 'all' ? 'All Devices' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-4">
            {filteredHistory.map((item) => (
              <div 
                key={item.sessionId}
                className="p-6 rounded-3xl bg-white border-2 border-[#103D29]/15 hover:border-[#103D29] hover:shadow-editorial-lg transition-all flex items-center justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#FFF3E5] text-[#103D29] border border-[#103D29]/20">
                      {item.deviceId.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-[#68736A]">
                      {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl text-[#17251D]">{item.issueId}</h3>
                  {item.problemText && (
                    <p className="text-sm text-[#68736A] italic">"{item.problemText}"</p>
                  )}
                  <div className="flex items-center gap-4 text-xs font-extrabold">
                    {item.score !== undefined && (
                      <span className="text-[#103D29]">Repairability: {item.score}/100</span>
                    )}
                    {item.decision && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
                          item.decision.toLowerCase().includes('repair')
                            ? 'bg-[#dcebd9] text-[#103D29] border border-[#2f8f5b]/30'
                            : 'bg-[#f8b08c]/40 text-[#16301f] border border-[#f08a5d]/30'
                        }`}
                      >
                        Verdict: {item.decision.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/result?session=${item.sessionId}`)}
                  className="p-3 rounded-2xl bg-[#FFF3E5] hover:bg-[#103D29] text-[#103D29] hover:text-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
