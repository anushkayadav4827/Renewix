import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import DeviceSelection from './pages/DeviceSelection';
import DeviceIntake from './pages/DeviceIntake';
import ProblemDescription from './pages/ProblemDescription';
import DiagnosticInterview from './pages/DiagnosticInterview';
import AnalyzingState from './pages/AnalyzingState';
import SafetyWarning from './pages/SafetyWarning';
import DiagnosisResult from './pages/DiagnosisResult';
import RepairabilityScore from './pages/RepairabilityScore';
import RepairVsReplace from './pages/RepairVsReplace';
import ReplacementDeals from './pages/ReplacementDeals';
import SecondHandMarketplace from './pages/SecondHandMarketplace';
import ProviderNetwork from './pages/ProviderNetwork';
import RepairHistory from './pages/RepairHistory';
import ProfileSettings from './pages/ProfileSettings';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';

import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import RenewixLogo from './components/RenewixLogo';
import { Home as HomeIcon } from 'lucide-react';

/**
 * Clean Top Bar for Internal App Pages (No Marketing Navbar or Footer)
 */
function InternalTopBar() {
  const location = useLocation();

  // Determine back destination or section name
  const getSectionTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/device')) return 'Step 1: Select Category';
    if (path.startsWith('/intake')) return 'Step 2: Device Details';
    if (path.startsWith('/problem')) return 'Step 3: Issue Description';
    if (path.startsWith('/interview')) return 'Step 4: Diagnostic Interview';
    if (path.startsWith('/analyzing')) return 'AI Diagnostic Engine';
    if (path.startsWith('/result')) return 'Diagnostic Clinical Results';
    if (path.startsWith('/compare')) return 'Repair vs. Replace Verdict';
    if (path.startsWith('/deals') || path.startsWith('/replacement')) return 'Replacement Marketplace & Deals';
    if (path.startsWith('/providers')) return 'Verified Repair Network';
    if (path.startsWith('/history')) return 'Diagnostic History';
    if (path.startsWith('/dashboard')) return 'Member Dashboard';
    if (path.startsWith('/profile')) return 'Profile & Settings';
    if (path.startsWith('/admin')) return 'Network Administration';
    if (path.startsWith('/auth')) return 'Account Authentication';
    return 'Diagnostics';
  };

  return (
    <header className="w-full bg-[#fdf1e4]/85 backdrop-blur-[18px] backdrop-saturate-[140%] text-[#16301f] border-b border-[#0f3b28]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_20px_rgba(10,42,29,0.06)]">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <RenewixLogo theme="dark" size="sm" />
        </Link>
        <span className="hidden sm:inline-block w-px h-5 bg-[#0f3b28]/15" />
        <span className="text-xs font-bold text-[#0f3b28] truncate">
          {getSectionTitle()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-bold text-[#16301f]/80 hover:text-[#0f3b28] px-3 py-1.5 rounded-full hover:bg-[#0f3b28]/5 transition-all cursor-pointer"
          title="Exit to Landing Page"
        >
          <HomeIcon className="w-3.5 h-3.5 text-[#0f3b28]" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>
    </header>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FFF3E5] text-[#17251D] flex flex-col font-sans selection:bg-[#F9C49B]/50 selection:text-[#103D29]">
      {/* Sleek Minimal App Header (Cream glass, forest text) */}
      <InternalTopBar />
      
      {/* Full-Width Canvas - Utilizing all horizontal screen space */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <LayoutWrapper>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Home />} />
            
            {/* Authentication */}
            <Route path="/auth" element={<Auth />} />

            {/* User Dashboard & Profile */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            {/* Diagnostic Intake & Reasoning Flow */}
            <Route path="/device" element={<ProtectedRoute><DeviceSelection /></ProtectedRoute>} />
            <Route path="/intake" element={<ProtectedRoute><DeviceIntake /></ProtectedRoute>} />
            <Route path="/problem" element={<ProtectedRoute><ProblemDescription /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><DiagnosticInterview /></ProtectedRoute>} />
            <Route path="/analyzing" element={<ProtectedRoute><AnalyzingState /></ProtectedRoute>} />
            <Route path="/safety-warning" element={<ProtectedRoute><SafetyWarning /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><DiagnosisResult /></ProtectedRoute>} />
            <Route path="/score" element={<ProtectedRoute><RepairabilityScore /></ProtectedRoute>} />

            {/* AI Decision Verdict & Economic Debate */}
            <Route path="/compare" element={<ProtectedRoute><RepairVsReplace /></ProtectedRoute>} />
            
            {/* History */}
            <Route path="/history" element={<ProtectedRoute><RepairHistory /></ProtectedRoute>} />

            {/* Marketplaces */}
            <Route path="/providers" element={<ProviderNetwork />} />
            <Route path="/deals" element={<ReplacementDeals />} />
            <Route path="/replacement" element={<ReplacementDeals />} />
            <Route path="/marketplace/second-hand" element={<SecondHandMarketplace />} />
            <Route path="/price-tracking" element={<ReplacementDeals />} />
          </Routes>
        </LayoutWrapper>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
