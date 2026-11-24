import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signIn, signUp, confirmSignUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, KeyRound, Check, Leaf } from 'lucide-react';
import RenewixLogo from '../components/RenewixLogo';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' | 'register' | 'forgot' | 'verify' | 'reset-confirm'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'verify' | 'reset-confirm'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (authMode === 'verify') {
        await confirmSignUp({ username: email, confirmationCode: code });
        // Automatically attempt sign in after confirmation
        const signInResult = await signIn({ username: email, password });
        if (signInResult?.isSignedIn) {
          redirectAfterLogin();
          return;
        }
        setSuccessMsg('Email verified successfully! You can now log in.');
        setAuthMode('login');
      } else if (authMode === 'login') {
        const signInResult = await signIn({ username: email, password });
        if (signInResult && signInResult.isSignedIn) {
          redirectAfterLogin();
        } else {
          setError('Please complete the authentication steps.');
        }
      } else if (authMode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        await signUp({
          username: email,
          password,
          options: { userAttributes: { email } },
        });
        setAuthMode('verify');
        setSuccessMsg('Verification code sent to your email.');
      } else if (authMode === 'forgot') {
        await resetPassword({ username: email });
        setAuthMode('reset-confirm');
        setSuccessMsg('Reset code sent to your email.');
      } else if (authMode === 'reset-confirm') {
        await confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword: newPassword,
        });
        setSuccessMsg('Password reset successfully! Please log in with your new password.');
        setAuthMode('login');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const redirectAfterLogin = () => {
    const state = location.state as any;
    const from = state?.from ? `${state.from.pathname}${state.from.search}` : '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-6xl w-full mx-auto py-6 flex items-center justify-center animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Split-Screen Editorial Card Container */}
      <div className="w-full bg-[#F9EBDD] rounded-4xl border border-[#103D29]/15 shadow-editorial-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Left Column: Forest Green Editorial Brand Showcase (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0B2D20] via-[#103D29] to-[#071F16] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9C49B]/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#174C32]/40 rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <Link to="/" className="inline-block">
                <RenewixLogo theme="light" size="lg" />
              </Link>
              
              <div className="space-y-3 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174C32] border border-[#D9E5C4]/20 text-[#D9E5C4] text-xs font-semibold">
                  <Leaf className="w-3.5 h-3.5 text-[#F9C49B]" />
                  <span>Circular Electronics</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  Before You Replace It.{' '}
                  <span className="font-editorial italic font-normal text-[#F9C49B]">
                    Give It a Second Thought.
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Join thousands of conscious consumers saving up to 80% on gadget costs while keeping toxic e-waste out of landfills.
                </p>
              </div>
            </div>

            {/* Bottom Guarantee */}
            <div className="pt-8 border-t border-white/10 relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D9E5C4]">
                <ShieldCheck className="w-4 h-4 text-[#F9C49B]" />
                <span>Zero Sales Bias Guarantee</span>
              </div>
              <p className="text-[11px] text-white/60">
                We never recommend replacement when repair is financially and technically viable.
              </p>
            </div>
          </div>

          {/* Right Column: Clean Form Container (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-[#F9EBDD]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17251D]">
                  {authMode === 'login' && 'Welcome Back'}
                  {authMode === 'register' && 'Create Your Account'}
                  {authMode === 'verify' && 'Verify Your Email'}
                  {authMode === 'forgot' && 'Reset Password'}
                  {authMode === 'reset-confirm' && 'Enter Reset Code'}
                </h3>

                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setError(''); }}
                    className="text-xs font-bold text-[#103D29] hover:underline"
                  >
                    New user? Sign up
                  </button>
                )}
                {authMode === 'register' && (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setError(''); }}
                    className="text-xs font-bold text-[#103D29] hover:underline"
                  >
                    Have an account? Log in
                  </button>
                )}
              </div>
              
              <p className="text-xs sm:text-sm text-[#68736A]">
                {authMode === 'login' && 'Log in to track your device health, saved quotes, and repair history.'}
                {authMode === 'register' && 'Create a free account to unlock clinical diagnostics and repairability telemetry.'}
                {authMode === 'verify' && `We sent a 6-digit confirmation code to ${email}.`}
                {authMode === 'forgot' && "Enter your email address and we'll send a password recovery code."}
                {authMode === 'reset-confirm' && 'Enter the confirmation code from your email and your new password.'}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 font-semibold flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-[#103D29] font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {/* Email Input */}
              {(authMode === 'login' || authMode === 'register' || authMode === 'forgot' || authMode === 'verify') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17251D] block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#68736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={authMode === 'verify'}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-[#103D29]/15 rounded-2xl pl-10 pr-4 py-3 text-sm text-[#17251D] focus:outline-none focus:border-[#103D29] focus:ring-1 focus:ring-[#103D29] transition-all disabled:opacity-60"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password Input (for Login & Register) */}
              {(authMode === 'login' || authMode === 'register') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#17251D]">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot'); setError(''); }}
                        className="text-xs text-[#68736A] hover:text-[#103D29] transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#103D29]/15 rounded-2xl pl-10 pr-4 py-3 text-sm text-[#17251D] focus:outline-none focus:border-[#103D29] focus:ring-1 focus:ring-[#103D29] transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Confirm Password (for Register) */}
              {authMode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17251D] block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#103D29]/15 rounded-2xl pl-10 pr-4 py-3 text-sm text-[#17251D] focus:outline-none focus:border-[#103D29] focus:ring-1 focus:ring-[#103D29] transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Verification Code Input (for Verify or Reset-Confirm) */}
              {(authMode === 'verify' || authMode === 'reset-confirm') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17251D] block">6-Digit Verification Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#68736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full bg-white border border-[#103D29]/15 rounded-2xl pl-10 pr-4 py-3 text-sm font-mono tracking-widest text-[#17251D] focus:outline-none focus:border-[#103D29] focus:ring-1 focus:ring-[#103D29] transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* New Password (for Reset-Confirm) */}
              {authMode === 'reset-confirm' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17251D] block">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#68736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 8 characters)"
                      className="w-full bg-white border border-[#103D29]/15 rounded-2xl pl-10 pr-4 py-3 text-sm text-[#17251D] focus:outline-none focus:border-[#103D29] focus:ring-1 focus:ring-[#103D29] transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button (Peach primary button) */}
              <button
                type="submit"
                disabled={loading}
                className="btn-peach w-full !py-3.5 !text-sm justify-center shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#16301F]" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === 'login' && 'Sign In to Renewix'}
                      {authMode === 'register' && 'Create Account'}
                      {authMode === 'verify' && 'Confirm & Complete'}
                      {authMode === 'forgot' && 'Send Reset Code'}
                      {authMode === 'reset-confirm' && 'Update Password & Login'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#16301F]" />
                  </>
                )}
              </button>

              {/* Back to Login Link for secondary modes */}
              {authMode !== 'login' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                    className="text-xs font-semibold text-[#68736A] hover:text-[#103D29] transition-colors"
                  >
                    ← Back to Login
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
  );
}
