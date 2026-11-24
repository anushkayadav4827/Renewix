import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SafetyWarning() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500 py-8">
      <div className="flex flex-col items-center text-center p-8 sm:p-10 bg-white border-2 border-red-500/30 rounded-3xl shadow-editorial space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center border-2 border-red-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-red-700">Stop Use Immediately</h2>
          <p className="text-[#17251D] font-medium max-w-md leading-relaxed text-sm">
            Based on your answers (such as burning smell, battery swelling, or smoke), this device poses an immediate fire or electrical shock hazard. Do not attempt to charge or power it on.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Link 
          to="/"
          className="flex items-center justify-center w-full min-h-[48px] p-4 rounded-full bg-[#103D29] hover:bg-[#174C32] text-white font-extrabold text-sm transition-colors shadow-editorial"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
