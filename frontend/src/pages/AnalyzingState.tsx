import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Sparkles, AlertCircle } from 'lucide-react';
import { api, sessionStore } from '../lib/api';
import { BRAND } from '../lib/constants';

const ROTATING_COPY = [
  'Querying authorized parts availability & component supply telemetry...',
  'Calculating deterministic Repairability Score across 5 engineering pillars...',
  'Simulating AI Multi-Agent debate between Repair and Replacement economics...',
  'Cross-referencing verified local repair shops & replacement price trackers...',
  'Synthesizing clinical diagnostic verdict and financial survival outlook...',
];

export default function AnalyzingState() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [copyIndex, setCopyIndex] = useState(0);

  // Rotating micro-copy timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCopyIndex((prev) => (prev + 1) % ROTATING_COPY.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sessionId = sessionStore.getSessionId();
    const storedAnswers = sessionStorage.getItem('answers');

    if (!sessionId || !storedAnswers) {
      navigate('/');
      return;
    }

    const answers = JSON.parse(storedAnswers);

    api
      .analyzeDiagnosis(sessionId, answers)
      .then((res) => {
        const result = res?.data || res;

        if (result.status === 'NEEDS_INFO') {
          const currentQs = sessionStore.getQuestions();
          sessionStore.setQuestions([...currentQs, ...result.newQuestions]);
          navigate('/interview');
          return;
        }

        sessionStorage.setItem('diagnosisResult', JSON.stringify(result));

        // Save to history before navigating
        api
          .saveRepairHistory(sessionId)
          .catch((err) => {
            console.error('[AnalyzingState] Failed to save history:', err);
          })
          .finally(() => {
            if (result.safetyWarning) {
              navigate('/safety-warning');
            } else {
              navigate('/result');
            }
          });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Analysis failed. Please try again.');
      });
  }, [navigate]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] p-4 animate-in fade-in duration-500">
      {/* Forest Card with Breathing Recycle Icon */}
      <div className="w-full bg-[#0f3b28] text-[#fdf1e4] rounded-3xl sm:rounded-4xl p-8 sm:p-14 border border-[#14482f] shadow-editorial-lg text-center space-y-8 relative overflow-hidden">
        {/* Soft Ambient Radial Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#2f8f5b]/20 rounded-full blur-[90px] pointer-events-none" />

        {/* Breathing Recycle Icon */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#2f8f5b]/20 animate-ping opacity-60" />
          <div className="w-24 h-24 rounded-full bg-[#14482f] border-2 border-[#2f8f5b]/40 flex items-center justify-center shadow-lg animate-pulse">
            <Recycle className="w-12 h-12 text-[#dcebd9] animate-spin-very-slow" />
          </div>
        </div>

        {/* Main Status & Rotating Micro-Copy */}
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#14482f] text-[#dcebd9] text-xs font-bold border border-[#dcebd9]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#f8b08c]" />
            <span>AI Clinical Analysis in Progress</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {BRAND} AI is analyzing your device...
          </h2>

          <div className="h-12 flex items-center justify-center">
            <p className="text-sm text-[#f8b08c] font-semibold transition-opacity duration-300 max-w-md">
              {ROTATING_COPY[copyIndex]}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-900/40 border border-red-500/40 text-red-200 text-xs font-bold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
