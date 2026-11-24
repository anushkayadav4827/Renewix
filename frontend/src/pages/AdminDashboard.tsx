import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Wrench,
  CheckCircle2,
  Search,
} from 'lucide-react';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const sampleProviders = [
    {
      id: 'P-101',
      name: 'Indiranagar Mobile Glass & Screen Hub',
      city: 'Bengaluru',
      rating: 4.8,
      verified: true,
      activeJobs: 14,
      specialty: 'AMOLED & Glass Laminate',
    },
    {
      id: 'P-102',
      name: 'Bandra Phone Clinic',
      city: 'Mumbai',
      rating: 4.9,
      verified: true,
      activeJobs: 9,
      specialty: 'Motherboard IC & Charging',
    },
    {
      id: 'P-103',
      name: 'Connaught Place Smart Care',
      city: 'Delhi',
      rating: 4.7,
      verified: true,
      activeJobs: 21,
      specialty: 'Battery & Screen Express',
    },
    {
      id: 'P-104',
      name: 'Hitech City Device Rescue',
      city: 'Hyderabad',
      rating: 4.8,
      verified: true,
      activeJobs: 16,
      specialty: 'Laptops & Tablets Repair',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#103D29]/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#103D29] text-[#D9E5C4] text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-[#F9C49B]" />
              <span>Renewix Network Administration</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#17251D]">
              Platform & Provider Management
            </h1>
            <p className="text-xs sm:text-sm text-[#68736A]">
              Monitor verified repair centers, DynamoDB diagnostic logs, and platform sustainability telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#D9E5C4] text-[#103D29] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Back2LifeTable-dev · Active</span>
            </span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 shadow-editorial space-y-1">
            <div className="text-xs text-[#68736A] font-semibold">Active Providers</div>
            <div className="text-2xl font-extrabold text-[#103D29]">72 Verified</div>
          </div>
          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 shadow-editorial space-y-1">
            <div className="text-xs text-[#68736A] font-semibold">Diagnoses Today</div>
            <div className="text-2xl font-extrabold text-[#17251D]">148 Tests</div>
          </div>
          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 shadow-editorial space-y-1">
            <div className="text-xs text-[#68736A] font-semibold">Repair Verdict Ratio</div>
            <div className="text-2xl font-extrabold text-[#10B981]">76.4% Repair</div>
          </div>
          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 shadow-editorial space-y-1">
            <div className="text-xs text-[#68736A] font-semibold">Diverted E-Waste</div>
            <div className="text-2xl font-extrabold text-[#103D29]">1.8 Tons</div>
          </div>
        </div>

        {/* Provider Network Table */}
        <div className="bg-[#F9EBDD] rounded-3xl p-6 sm:p-8 border border-[#103D29]/10 shadow-editorial space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#17251D] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#103D29]" />
              <span>Verified Local Repair Provider Registry</span>
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#68736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shops or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#103D29]/15 rounded-2xl pl-10 pr-4 py-2 text-xs text-[#17251D] focus:outline-none focus:border-[#103D29]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#103D29]/10 text-[#68736A] uppercase font-bold">
                  <th className="py-3 px-3">Center Name</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3">Specialty</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#103D29]/5">
                {sampleProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#17251D]">{provider.name}</td>
                    <td className="py-3.5 px-3 text-[#68736A]">{provider.city}</td>
                    <td className="py-3.5 px-3 text-[#17251D]">{provider.specialty}</td>
                    <td className="py-3.5 px-3 font-bold text-[#103D29]">★ {provider.rating}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9E5C4] text-[#103D29]">
                        <CheckCircle2 className="w-3 h-3 text-[#103D29]" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to="/providers"
                        className="text-xs font-bold text-[#103D29] hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
