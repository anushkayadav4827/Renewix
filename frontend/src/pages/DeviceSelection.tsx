import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Smartphone,
  Headphones,
  Tv,
  WashingMachine,
  Refrigerator,
  AirVent,
  Wifi,
  Printer,
  Blend,
  Coffee,
  Gamepad2,
  BatteryCharging,
  Watch,
  Tablet,
  Microwave,
  Camera,
  Speaker,
  Monitor,
  Wind,
  Snowflake,
  Cpu,
  Search,
  X,
} from 'lucide-react';
import { api } from '../lib/api';

interface DeviceItem {
  deviceId: string;
  name: string;
  icon?: string;
  commonSymptoms?: string[];
  category?: 'all' | 'personal' | 'appliances' | 'entertainment';
}

const ICONS: Record<string, { icon: any; color: string; bg: string; category: 'personal' | 'appliances' | 'entertainment' }> = {
  smartphone: { icon: Smartphone, color: 'text-emerald-400', bg: 'bg-emerald-400/10', category: 'personal' },
  laptop: { icon: Laptop, color: 'text-blue-400', bg: 'bg-blue-400/10', category: 'personal' },
  headphones: { icon: Headphones, color: 'text-purple-400', bg: 'bg-purple-400/10', category: 'entertainment' },
  television: { icon: Tv, color: 'text-cyan-400', bg: 'bg-cyan-400/10', category: 'entertainment' },
  washing_machine: { icon: WashingMachine, color: 'text-sky-400', bg: 'bg-sky-400/10', category: 'appliances' },
  refrigerator: { icon: Refrigerator, color: 'text-teal-400', bg: 'bg-teal-400/10', category: 'appliances' },
  air_conditioner: { icon: AirVent, color: 'text-indigo-400', bg: 'bg-indigo-400/10', category: 'appliances' },
  router: { icon: Wifi, color: 'text-violet-400', bg: 'bg-violet-400/10', category: 'personal' },
  printer: { icon: Printer, color: 'text-amber-400', bg: 'bg-amber-400/10', category: 'personal' },
  mixer_blender: { icon: Blend, color: 'text-orange-400', bg: 'bg-orange-400/10', category: 'appliances' },
  electric_kettle: { icon: Coffee, color: 'text-rose-400', bg: 'bg-rose-400/10', category: 'appliances' },
  gaming_console: { icon: Gamepad2, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', category: 'entertainment' },
  power_bank: { icon: BatteryCharging, color: 'text-lime-400', bg: 'bg-lime-400/10', category: 'personal' },
  smartwatch: { icon: Watch, color: 'text-pink-400', bg: 'bg-pink-400/10', category: 'personal' },
  tablet: { icon: Tablet, color: 'text-emerald-300', bg: 'bg-emerald-300/10', category: 'personal' },
  microwave: { icon: Microwave, color: 'text-yellow-400', bg: 'bg-yellow-400/10', category: 'appliances' },
  camera: { icon: Camera, color: 'text-red-400', bg: 'bg-red-400/10', category: 'entertainment' },
  speaker: { icon: Speaker, color: 'text-purple-300', bg: 'bg-purple-300/10', category: 'entertainment' },
  desktop_pc: { icon: Monitor, color: 'text-blue-300', bg: 'bg-blue-300/10', category: 'personal' },
  vacuum_cleaner: { icon: Wind, color: 'text-teal-300', bg: 'bg-teal-300/10', category: 'appliances' },
  water_purifier: { icon: Snowflake, color: 'text-cyan-300', bg: 'bg-cyan-300/10', category: 'appliances' },
  other_device: { icon: Cpu, color: 'text-slate-300', bg: 'bg-slate-300/10', category: 'personal' },
};

const DEFAULT_DEVICES: DeviceItem[] = [
  { deviceId: 'smartphone', name: 'Smartphone', icon: 'smartphone' },
  { deviceId: 'laptop', name: 'Laptop', icon: 'laptop' },
  { deviceId: 'headphones', name: 'Headphones', icon: 'headphones' },
  { deviceId: 'television', name: 'Television', icon: 'television' },
  { deviceId: 'washing_machine', name: 'Washing Machine', icon: 'washing_machine' },
  { deviceId: 'refrigerator', name: 'Refrigerator', icon: 'refrigerator' },
  { deviceId: 'air_conditioner', name: 'Air Conditioner', icon: 'air_conditioner' },
  { deviceId: 'router', name: 'Router / WiFi', icon: 'router' },
  { deviceId: 'printer', name: 'Printer', icon: 'printer' },
  { deviceId: 'mixer_blender', name: 'Mixer / Blender', icon: 'mixer_blender' },
  { deviceId: 'electric_kettle', name: 'Electric Kettle', icon: 'electric_kettle' },
  { deviceId: 'gaming_console', name: 'Gaming Console', icon: 'gaming_console' },
  { deviceId: 'power_bank', name: 'Power Bank', icon: 'power_bank' },
  { deviceId: 'smartwatch', name: 'Smartwatch', icon: 'smartwatch' },
  { deviceId: 'tablet', name: 'Tablet', icon: 'tablet' },
  { deviceId: 'microwave', name: 'Microwave Oven', icon: 'microwave' },
  { deviceId: 'camera', name: 'Digital Camera', icon: 'camera' },
  { deviceId: 'speaker', name: 'Bluetooth Speaker', icon: 'speaker' },
  { deviceId: 'desktop_pc', name: 'Desktop PC', icon: 'desktop_pc' },
  { deviceId: 'vacuum_cleaner', name: 'Vacuum Cleaner', icon: 'vacuum_cleaner' },
  { deviceId: 'water_purifier', name: 'Water Purifier', icon: 'water_purifier' },
  { deviceId: 'other_device', name: 'Other Device', icon: 'other_device' },
];

const formatDeviceName = (name: string) => {
  if (name.includes('Headphones')) return 'Headphones';
  if (name.includes('Water Purifier')) return 'Water Purifier';
  if (name.includes('Washing Machine')) return 'Washing Machine';
  if (name.includes('Air Conditioner')) return 'Air Conditioner';
  if (name.includes('Bluetooth Speaker')) return 'Bluetooth Speaker';
  return name;
};

export default function DeviceSelection() {
  const [devices, setDevices] = useState<DeviceItem[]>(DEFAULT_DEVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'appliances' | 'entertainment'>('all');

  useEffect(() => {
    api.getDevices().then((res) => {
      const incoming: DeviceItem[] = res.data?.devices || [];
      if (incoming.length > 0) {
        // Merge with defaults to preserve complete catalogue and ordering
        const incomingMap = new Map(incoming.map(d => [d.deviceId, d]));
        const merged = DEFAULT_DEVICES.map(d => incomingMap.get(d.deviceId) || d);
        // Include any additional devices from API not present in defaults
        incoming.forEach(d => {
          if (!DEFAULT_DEVICES.some(def => def.deviceId === d.deviceId)) {
            merged.push(d);
          }
        });
        setDevices(merged);
      }
    }).catch((err) => {
      console.warn('API getDevices had an issue, using full fallback device catalogue:', err);
    });
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const style = ICONS[device.deviceId];
      const category = style?.category || 'personal';

      const matchesTab = activeTab === 'all' || category === activeTab;
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.deviceId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [devices, searchQuery, activeTab]);

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Multi-Step Diagnostic Progress Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#103D29]/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#17251D]">
          <span className="flex items-center gap-2 text-[#103D29]">
            <span className="w-6 h-6 rounded-full bg-[#103D29] text-white flex items-center justify-center text-xs">1</span>
            Step 1 of 4: Select Device Category
          </span>
          <span className="text-[#68736A]">Next: Specifications & Intake</span>
        </div>
        <div className="w-full h-2 bg-[#103D29]/10 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-[#103D29] rounded-full transition-all duration-500" />
        </div>
      </div>

      <div className="text-center space-y-3 py-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9E5C4]/70 border border-[#103D29]/20 text-[#103D29] text-xs font-bold uppercase tracking-wider">
          AI Hardware Diagnostics
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17251D]">
          What device needs fixing?
        </h2>
        <p className="text-sm sm:text-base text-[#68736A] max-w-2xl mx-auto font-medium leading-relaxed">
          Select an electronic device or appliance to run AI diagnostic reasoning, calculate repairability scores, and compare repair vs. replacement costs.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-[#103D29]/15 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Devices' },
            { id: 'personal', label: 'Personal Tech' },
            { id: 'appliances', label: 'Home Appliances' },
            { id: 'entertainment', label: 'Entertainment' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#103D29] text-white shadow-md'
                  : 'bg-white text-[#17251D] border border-[#103D29]/15 hover:bg-[#F9EBDD] hover:text-[#103D29]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#103D29] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search device name, brand, or type..."
            className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#17251D] font-medium focus:outline-none focus:border-[#103D29] placeholder:text-[#68736A]/80 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#68736A] hover:text-[#17251D]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Full-width Responsive Device Grid (Spacious Clean Boxes, Full Text Visible Without Truncation) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredDevices.map((device) => {
          const style = ICONS[device.deviceId] || {
            icon: Cpu,
            color: 'text-[#103D29]',
            bg: 'bg-[#D9E5C4]',
          };
          const Icon = style.icon;
          const displayName = formatDeviceName(device.name);

          return (
            <Link
              key={device.deviceId}
              to={`/intake?device=${device.deviceId}`}
              className="group relative flex items-center gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5 min-h-[64px] sm:min-h-[72px] rounded-2xl bg-white border-2 border-[#103D29]/15 hover:border-[#103D29] hover:bg-[#FFF3E5]/60 hover:shadow-editorial-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              title={`Diagnose ${displayName}`}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#D9E5C4] text-[#103D29] flex items-center justify-center ring-1 ring-[#103D29]/20 transition-transform group-hover:scale-105 duration-200 shadow-xs shrink-0">
                <Icon className="w-5 h-5 text-[#103D29]" />
              </div>
              <span className="font-extrabold text-[#17251D] group-hover:text-[#103D29] text-xs sm:text-sm transition-colors leading-snug line-clamp-2 break-words flex-1">
                {displayName}
              </span>
            </Link>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-16 space-y-4 bg-white rounded-3xl border-2 border-dashed border-[#103D29]/20 shadow-sm">
          <p className="text-base font-bold text-[#17251D]">No devices found matching "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
            className="px-5 py-2.5 rounded-xl bg-[#103D29] text-white text-xs sm:text-sm font-extrabold hover:bg-[#174C32] transition-colors shadow-sm"
          >
            Clear Search & Show All Devices
          </button>
        </div>
      )}
    </div>
  );
}
