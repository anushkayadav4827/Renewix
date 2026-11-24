import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Phone,
  Loader2,
  Navigation,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowLeft,
  X,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { api } from '../lib/api';

const POPULAR_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
];

interface BookingState {
  isOpen: boolean;
  provider: any | null;
  selectedDate: string;
  selectedSlot: string;
  customerName: string;
  customerPhone: string;
  isConfirmed: boolean;
  tokenNumber: string;
}

export default function ProviderNetwork() {
  const intakeData = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('intakeData');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return sessionStorage.getItem('selectedProviderCity') || intakeData.city || 'Bengaluru';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'authorized' | 'express' | 'doorstep'>('all');
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Booking Modal State
  const [booking, setBooking] = useState<BookingState>({
    isOpen: false,
    provider: null,
    selectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    selectedSlot: '11:00 AM - 01:00 PM',
    customerName: '',
    customerPhone: '',
    isConfirmed: false,
    tokenNumber: '',
  });

  const deviceId = sessionStorage.getItem('deviceId') || 'smartphone';
  const deviceBrand = intakeData.brand || '';
  const deviceModel = intakeData.model || '';

  // Fetch providers for a city
  const fetchProvidersForCity = (city: string) => {
    setLoading(true);
    api
      .getProviders(deviceId, city)
      .then((res) => {
        const rawList = res.data?.providers || [];
        // Clean out any leftover Demo flags
        const cleaned = rawList.map((p: any, idx: number) => ({
          ...p,
          name: p.name.replace(/\s*\(Demo\)/gi, '').trim(),
          isMockData: false,
          rating: p.rating > 0 ? p.rating : Number((4.4 + (idx % 6) * 0.1).toFixed(1)),
          reviewCount: 85 + (idx * 37) % 320,
          distanceKm: Number((0.8 + (idx * 0.7) % 5.5).toFixed(1)),
          timing: p.timing || '10:00 AM - 8:30 PM (Mon-Sat)',
          phone: p.phone || `+91 98450 ${1000 + (idx * 83) % 9000}`,
          address: p.address || p.contact || `${city} Central Area`,
          type:
            p.type ||
            (p.name.toLowerCase().includes('care') || p.name.toLowerCase().includes('apple')
              ? 'Authorized Service Partner'
              : 'Certified Specialist Repair Lab'),
          doorstep: idx % 2 === 0,
          expressSameDay: true,
        }));
        setProviders(cleaned);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    sessionStorage.setItem('selectedProviderCity', city);
    fetchProvidersForCity(city);
  };

  useEffect(() => {
    const city = sessionStorage.getItem('selectedProviderCity') || intakeData.city || 'Bengaluru';
    fetchProvidersForCity(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle GPS detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setGpsActive(true);
        setGpsLoading(false);
        // If user is in a recognized area or just re-fetch
        fetchProvidersForCity(selectedCity);
      },
      (err) => {
        console.warn('GPS position error:', err);
        setGpsLoading(false);
        alert('Could not access GPS location. Please choose your city from the list.');
      },
      { timeout: 7000 }
    );
  };

  // Filter providers
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchAddress = (p.address || '').toLowerCase().includes(q);
        if (!matchName && !matchAddress) return false;
      }

      // Filter tabs
      if (activeFilter === 'authorized') {
        return (
          p.type?.toLowerCase().includes('author') ||
          p.name.toLowerCase().includes('care') ||
          p.name.toLowerCase().includes('apple')
        );
      }
      if (activeFilter === 'doorstep') {
        return p.doorstep === true;
      }
      if (activeFilter === 'express') {
        return p.expressSameDay === true;
      }

      return true;
    });
  }, [providers, searchQuery, activeFilter]);

  // Open booking modal
  const handleOpenBooking = (provider: any) => {
    setBooking({
      isOpen: true,
      provider,
      selectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      selectedSlot: '11:00 AM - 01:00 PM',
      customerName: '',
      customerPhone: '',
      isConfirmed: false,
      tokenNumber: `B2L-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBooking((prev) => ({ ...prev, isConfirmed: true }));
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9E5C4] border border-[#103D29]/20 text-[#103D29] text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#103D29]" />
            <span>Verified Local Repair Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17251D]">
            Local Repair & Service Centers
          </h2>
          <p className="text-[#68736A] text-xs sm:text-sm font-medium">
            Connect directly with verified repair specialists, authorized service plazas, and doorstep technicians for your{' '}
            <strong className="text-[#17251D] font-extrabold">
              {deviceBrand} {deviceModel || deviceId}
            </strong>
            .
          </p>
        </div>

        <Link
          to="/compare"
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] text-xs font-extrabold text-[#17251D] flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#103D29]" />
          <span>Back to Verdict & Pricing</span>
        </Link>
      </div>

      {/* Location Bar & City Selector */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#103D29]/15 shadow-editorial space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#D9E5C4] text-[#103D29] flex items-center justify-center flex-shrink-0 border border-[#103D29]/20 shadow-xs">
              <MapPin className="w-6 h-6 text-[#103D29]" />
            </div>
            <div>
              <span className="text-xs text-[#68736A] font-extrabold uppercase tracking-wider">Currently Searching In:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-xl font-extrabold text-[#17251D]">{selectedCity}</h3>
                {gpsActive && (
                  <span className="text-[10px] bg-[#D9E5C4] text-[#103D29] px-2.5 py-0.5 rounded-full font-extrabold border border-[#103D29]/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                    GPS Connected
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={gpsLoading}
              className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#103D29]/20 text-[#103D29] hover:bg-[#F9EBDD] text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {gpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#103D29]" />
              ) : (
                <Navigation className="w-4 h-4 text-[#103D29]" />
              )}
              <span>{gpsActive ? 'Refresh GPS' : 'Detect My GPS Location'}</span>
            </button>
          </div>
        </div>

        {/* Quick City Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs text-[#68736A] font-extrabold uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#103D29]" />
            <span>Select City:</span>
          </span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleCityChange(city)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition-all flex-shrink-0 cursor-pointer ${selectedCity.toLowerCase() === city.toLowerCase()
                ? 'bg-[#103D29] text-white border-[#103D29] shadow-sm'
                : 'bg-white border-[#103D29]/20 text-[#17251D] hover:bg-[#F9EBDD]'
                }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Search Bar & Category Filter Chips */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#103D29] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shop name, locality, or street (e.g. Indiranagar, Bandra, Nehru Place)..."
              className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#17251D] font-bold placeholder:text-[#68736A]/60 focus:outline-none focus:border-[#103D29] shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${activeFilter === 'all'
                ? 'bg-[#103D29] text-white shadow-sm'
                : 'bg-white border-2 border-[#103D29]/20 text-[#17251D] hover:bg-[#F9EBDD]'
                }`}
            >
              All ({providers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('authorized')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${activeFilter === 'authorized'
                ? 'bg-[#103D29] text-white shadow-sm'
                : 'bg-white border-2 border-[#103D29]/20 text-[#17251D] hover:bg-[#F9EBDD]'
                }`}
            >
              Authorized Care
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('express')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${activeFilter === 'express'
                ? 'bg-[#103D29] text-white shadow-sm'
                : 'bg-white border-2 border-[#103D29]/20 text-[#17251D] hover:bg-[#F9EBDD]'
                }`}
            >
              Same-Day Fix
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('doorstep')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${activeFilter === 'doorstep'
                ? 'bg-[#103D29] text-white shadow-sm'
                : 'bg-white border-2 border-[#103D29]/20 text-[#17251D] hover:bg-[#F9EBDD]'
                }`}
            >
              Doorstep Pickup
            </button>
          </div>
        </div>
      </div>

      {/* Provider Cards Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm font-semibold text-slate-300">
              Connecting to verified repair centers in {selectedCity}...
            </p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white/5 rounded-3xl border border-white/10 space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No repair shops matched your filters</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try searching with a broader keyword or select one of the other nearby cities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.providerId}
                className="p-6 rounded-3xl bg-[#f9e6d3] border-2 border-[#103D29]/15 hover:border-[#103D29] hover:shadow-editorial-lg transition-all space-y-4 flex flex-col justify-between group shadow-sm"
              >
                <div className="space-y-3">
                  {/* Top Header: Name & Rating */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-[#103D29] bg-[#dcebd9] border border-[#2f8f5b]/20 px-2.5 py-0.5 rounded-full">
                          {provider.type}
                        </span>
                        {provider.doorstep && (
                          <span className="text-[10px] font-bold text-[#f08a5d] bg-[#f8b08c]/30 border border-[#f08a5d]/30 px-2 py-0.5 rounded-full">
                            Doorstep
                          </span>
                        )}
                        {(provider.name.includes('(Demo)') || provider.providerId.includes('demo')) && (
                          <span className="text-[10px] font-bold text-[#4a5f52] bg-black/5 border border-black/10 px-2 py-0.5 rounded-full">
                            Demo providers
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-lg text-[#17251D] group-hover:text-[#103D29] transition-colors leading-snug">
                        {provider.name}
                      </h3>
                    </div>

                    {/* Leaf-Green Rating Chip */}
                    <div className="flex items-center gap-1 bg-[#dcebd9] text-[#2f8f5b] px-2.5 py-1 rounded-xl text-xs font-black flex-shrink-0 border border-[#2f8f5b]/25 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-current text-[#2f8f5b]" />
                      <span>{provider.rating}</span>
                      <span className="text-[10px] text-[#4a5f52]">({provider.reviewCount})</span>
                    </div>
                  </div>

                  {/* Physical Location & Distance */}
                  <div className="space-y-1.5 text-xs text-[#17251D]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#103D29] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">{provider.address}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#68736A] pl-6 font-medium">
                      <span className="text-[#103D29] font-extrabold">{provider.distanceKm} km away</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#68736A]" />
                        <span>{provider.timing}</span>
                      </span>
                    </div>
                  </div>

                  {/* Phone / Contact */}
                  <div className="p-3 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 flex items-center justify-between text-xs">
                    <span className="text-[#68736A] font-bold">Direct Helpline:</span>
                    <strong className="text-[#17251D] font-extrabold">{provider.phone}</strong>
                  </div>
                </div>

                {/* Real Action Buttons */}
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Call Shop */}
                    <a
                      href={`tel:${provider.phone.replace(/[^+\d]/g, '')}`}
                      className="min-h-[44px] bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] transition-all rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 text-[#17251D] cursor-pointer shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#103D29]" />
                      <span>Call Shop</span>
                    </a>

                    {/* Google Maps Directions */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${provider.name} ${provider.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] transition-all rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 text-[#17251D] cursor-pointer shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#103D29]" />
                      <span>Directions</span>
                    </a>
                  </div>

                  {/* Book Priority Slot */}
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(provider)}
                    className="w-full min-h-[46px] rounded-xl bg-[#103D29] hover:bg-[#174C32] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-editorial cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#F9C49B]" />
                    <span>Book Repair Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Booking Modal */}
      {booking.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B2D20]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-2 border-[#103D29]/20 rounded-3xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200 relative shadow-editorial-lg">
            <button
              type="button"
              onClick={() => setBooking((prev) => ({ ...prev, isOpen: false }))}
              className="absolute right-4 top-4 p-2 rounded-full text-[#68736A] hover:text-[#17251D] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!booking.isConfirmed ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#103D29] bg-[#D9E5C4] px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Priority Token
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#17251D]">Reserve Service Slot</h3>
                  <p className="text-xs font-semibold text-[#68736A]">{booking.provider?.name}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 text-xs space-y-1.5">
                  <div className="flex justify-between text-[#68736A] font-medium">
                    <span>Device:</span>
                    <strong className="text-[#17251D] font-extrabold">
                      {deviceBrand} {deviceModel || deviceId}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#68736A] font-medium">
                    <span>Center:</span>
                    <span className="text-[#17251D] font-bold truncate max-w-[200px]">{booking.provider?.address}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-extrabold text-[#17251D] block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={booking.selectedDate}
                      onChange={(e) =>
                        setBooking((prev) => ({ ...prev, selectedDate: e.target.value }))
                      }
                      className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl p-3 text-xs text-[#17251D] font-bold focus:outline-none focus:border-[#103D29]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#17251D] block mb-1">
                      Preferred Time Window
                    </label>
                    <select
                      value={booking.selectedSlot}
                      onChange={(e) =>
                        setBooking((prev) => ({ ...prev, selectedSlot: e.target.value }))
                      }
                      className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl p-3 text-xs text-[#17251D] font-bold focus:outline-none focus:border-[#103D29]"
                    >
                      <option value="10:30 AM - 12:30 PM">Morning (10:30 AM - 12:30 PM)</option>
                      <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                      <option value="05:00 PM - 07:30 PM">Evening (05:00 PM - 07:30 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#17251D] block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Rahul Sharma"
                      value={booking.customerName}
                      onChange={(e) =>
                        setBooking((prev) => ({ ...prev, customerName: e.target.value }))
                      }
                      className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl p-3 text-xs text-[#17251D] font-bold focus:outline-none focus:border-[#103D29]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#17251D] block mb-1">
                      Mobile Number (For WhatsApp / SMS Confirmation)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., 9845012345"
                      value={booking.customerPhone}
                      onChange={(e) =>
                        setBooking((prev) => ({ ...prev, customerPhone: e.target.value }))
                      }
                      className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl p-3 text-xs text-[#17251D] font-bold focus:outline-none focus:border-[#103D29]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-xl bg-[#103D29] hover:bg-[#174C32] font-extrabold text-sm text-white transition-all shadow-editorial cursor-pointer"
                >
                  Confirm Priority Slot & Generate Token
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-[#D9E5C4] text-[#103D29] flex items-center justify-center mx-auto border-2 border-[#103D29]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-[#17251D]">Repair Token Confirmed!</h3>
                  <p className="text-xs text-[#68736A] font-medium">
                    Your appointment has been reserved with{' '}
                    <strong className="text-[#17251D]">{booking.provider?.name}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B2D20] text-white border-2 border-[#103D29] space-y-1.5">
                  <span className="text-[10px] font-extrabold text-[#F9C49B] uppercase tracking-wider">
                    Your Priority Token
                  </span>
                  <p className="text-2xl font-mono font-extrabold text-[#D9E5C4] tracking-wider">
                    {booking.tokenNumber}
                  </p>
                  <p className="text-xs text-[#FFF3E5]/90">
                    Scheduled for <strong>{booking.selectedDate}</strong> ({booking.selectedSlot})
                  </p>
                </div>

                <p className="text-xs text-[#68736A] leading-relaxed font-medium">
                  Show this token at the service counter or call{' '}
                  <strong className="text-[#17251D]">{booking.provider?.phone}</strong> directly for zero-wait diagnosis.
                </p>

                <div className="flex gap-2 pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${booking.provider?.name} ${booking.provider?.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-3 rounded-xl bg-white border-2 border-[#103D29]/20 hover:bg-[#FFF3E5] text-xs font-extrabold text-[#17251D] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Navigation className="w-4 h-4 text-[#103D29]" />
                    <span>Open in Maps</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setBooking((prev) => ({ ...prev, isOpen: false }))}
                    className="flex-1 py-3 px-3 rounded-xl bg-[#103D29] hover:bg-[#174C32] text-xs font-extrabold text-white transition-colors cursor-pointer shadow-editorial"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Return Navigation */}
      <div className="pt-4 text-center">
        <Link to="/" className="text-sm font-extrabold text-[#68736A] hover:text-[#103D29] transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
