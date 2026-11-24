import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Bell,
  Smartphone,
  LogOut,
  Save,
  Check,
} from 'lucide-react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'devices' | 'notifications' | 'security'>('profile');
  const [userEmail, setUserEmail] = useState('');
  const [fullName, setFullName] = useState('Renewix Member');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification toggles
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyFestiveSales, setNotifyFestiveSales] = useState(true);
  const [notifySafetyAlerts, setNotifySafetyAlerts] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        setUserEmail(u.username || 'member@renewix.tech');
      })
      .catch(() => {
        setUserEmail('member@renewix.tech');
      });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#17251D]">Profile & Settings</h1>
        <p className="text-sm text-[#68736A]">
          Manage your account preferences, saved devices, alerts, and circular footprint data.
        </p>
      </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#103D29]/10 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'profile', label: 'Personal Info', icon: User },
            { id: 'devices', label: 'Saved Devices', icon: Smartphone },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Privacy', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#103D29] text-white shadow-sm'
                    : 'text-[#68736A] hover:text-[#17251D] hover:bg-black/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="bg-[#F9EBDD] rounded-3xl p-6 sm:p-8 border border-[#103D29]/10 shadow-editorial space-y-6">
            <h2 className="text-lg font-bold text-[#17251D]">Account Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17251D]">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-[#103D29]/15 rounded-2xl px-4 py-2.5 text-sm text-[#17251D] focus:outline-none focus:border-[#103D29]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17251D]">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-white/60 border border-[#103D29]/15 rounded-2xl px-4 py-2.5 text-sm text-[#68736A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17251D]">Phone / WhatsApp (for Price Alerts)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#103D29]/15 rounded-2xl px-4 py-2.5 text-sm text-[#17251D] focus:outline-none focus:border-[#103D29]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#103D29]/10">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#103D29] hover:bg-[#174C32] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#F9C49B]" />
                <span>Save Changes</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Preferences updated!
                </span>
              )}
            </div>
          </form>
        )}

        {/* Tab 2: Saved Devices */}
        {activeTab === 'devices' && (
          <div className="space-y-4">
            <div className="bg-[#F9EBDD] rounded-3xl p-6 border border-[#103D29]/10 shadow-editorial space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17251D]">OnePlus 8T</h3>
                  <p className="text-xs text-[#68736A]">Purchased Nov 2021 · Approx Price: ₹42,000</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D9E5C4] text-[#103D29]">
                  Health: Good (Display Repaired)
                </span>
              </div>
            </div>

            <div className="bg-[#F9EBDD] rounded-3xl p-6 border border-[#103D29]/10 shadow-editorial space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17251D]">MacBook Air M1</h3>
                  <p className="text-xs text-[#68736A]">Purchased Jan 2022 · Approx Price: ₹82,000</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F9C49B] text-[#103D29]">
                  Health: Battery Degraded
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-[#F9EBDD] rounded-3xl p-6 sm:p-8 border border-[#103D29]/10 shadow-editorial space-y-5">
            <h2 className="text-lg font-bold text-[#17251D]">Notification Settings</h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-white border border-[#103D29]/10">
                <div>
                  <div className="text-sm font-bold text-[#17251D]">Price-Drop Alerts</div>
                  <div className="text-xs text-[#68736A]">Receive instant alerts when tracked products hit your target price</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyPriceDrops}
                  onChange={(e) => setNotifyPriceDrops(e.target.checked)}
                  className="w-4 h-4 text-[#103D29] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-white border border-[#103D29]/10">
                <div>
                  <div className="text-sm font-bold text-[#17251D]">Festive Sale & Fake Discount Warnings</div>
                  <div className="text-xs text-[#68736A]">Alerts when upcoming seasonal tech sales will yield larger discounts</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyFestiveSales}
                  onChange={(e) => setNotifyFestiveSales(e.target.checked)}
                  className="w-4 h-4 text-[#103D29] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-white border border-[#103D29]/10">
                <div>
                  <div className="text-sm font-bold text-[#17251D]">Safety & Battery Health Alerts</div>
                  <div className="text-xs text-[#68736A]">Urgent warnings for lithium battery swelling or water ingress risks</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifySafetyAlerts}
                  onChange={(e) => setNotifySafetyAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#103D29] rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Logout */}
        {activeTab === 'security' && (
          <div className="bg-[#F9EBDD] rounded-3xl p-6 sm:p-8 border border-[#103D29]/10 shadow-editorial space-y-6">
            <h2 className="text-lg font-bold text-[#17251D]">Security & Account Actions</h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#103D29]/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#17251D]">Sign Out of Current Session</div>
                  <div className="text-xs text-[#68736A]">End your authenticated session on this browser</div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
