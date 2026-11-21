import React, { useState } from 'react';
import ContactCard from '../components/ContactCard';
import { Shield, FileCheck, Clock, CheckCircle2, MapPin, Phone, Building2, Search, ExternalLink } from 'lucide-react';
import centersData from '../../data/centers.json';

export default function Resources() {
  const [selectedRegionId, setSelectedRegionId] = useState('tashkent_city');
  const regions = centersData?.regions || [];
  const selectedRegion = regions.find((r) => r.region_id === selectedRegionId) || regions[0];

  return (
    <div className="py-2 sm:py-8 max-w-5xl mx-auto space-y-4 sm:space-y-8 animate-fade-in text-slate-900">
      
      {/* Title */}
      <div className="card-senior p-4 sm:p-6 lg:p-8 space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-heading font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          <span>Respublika Davlat Xizmatlari Katalogi</span>
        </div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
          Yordam Resurslari va «Inson» Markazlari
        </h1>
        <p className="text-xs sm:text-sm font-sans text-slate-600 max-w-2xl leading-relaxed">
          O‘zbekiston Respublikasi bo‘yicha rasmiy davlat, nodavlat va hududiy reabilitatsiya markazlari katalogi. Barcha xizmatlar 100% bepul va qonuniy himoyalangan.
        </p>
      </div>

      {/* Primary Emergency Hotlines */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-600">
            Respublika Bo‘yicha 24/7 Yagona Qisqa Raqamlar:
          </h2>
          <span className="text-[11px] sm:text-xs font-mono text-emerald-700 font-bold">24/7 Bepul</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <ContactCard contactKey="hotline_1146" />
          <ContactCard contactKey="police_102" />
          <ContactCard contactKey="cyber_102" />
          <ContactCard contactKey="inson_center" />
          <ContactCard contactKey="legal" />
          <ContactCard contactKey="psychologist" />
        </div>
      </div>

      {/* Regional Centers Directory with Dropdown */}
      <div className="card-senior p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span>Hududiy «Inson» va Ayollar Reabilitatsiya Markazlari</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">
              Yashash hududingizni tanlang va eng yaqin markaz bilan bog‘laning:
            </p>
          </div>

          <div className="w-full sm:min-w-[260px]">
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-heading font-bold text-slate-800 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs cursor-pointer"
            >
              {regions.map((reg) => (
                <option key={reg.region_id} value={reg.region_id}>
                  {reg.region_name_uz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Region Center Details Card */}
        {selectedRegion && (
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-emerald-700 block">
                  Hududiy Markaziy Boshqarma
                </span>
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  {selectedRegion.regional_center?.name || selectedRegion.region_name_uz}
                </h3>
              </div>

              {selectedRegion.regional_center?.hotline && (
                <a
                  href={`tel:${selectedRegion.regional_center.hotline.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedRegion.regional_center.hotline}</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-700">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                <span className="font-heading font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Manzil:</span>
                </span>
                <p className="text-slate-600 pl-5.5 leading-relaxed">
                  {selectedRegion.regional_center?.address || "Markaziy bino"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                <span className="font-heading font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ish tartibi:</span>
                </span>
                <p className="text-slate-600 pl-5.5 leading-relaxed">
                  Dushanba - Juma: 09:00 - 18:00 (Favqulodda xizmat: 24/7)
                </p>
              </div>
            </div>

            {/* District Branches */}
            {selectedRegion.districts && selectedRegion.districts.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-600">
                  Tuman Filiallari va Aloqa Telefonlari:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {selectedRegion.districts.map((dist, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-2 text-xs shadow-xs"
                    >
                      <span className="font-heading font-medium text-slate-800 truncate">
                        {dist.name}
                      </span>
                      <a
                        href={`tel:${dist.phone}`}
                        className="font-mono text-emerald-700 font-bold hover:underline shrink-0"
                      >
                        {dist.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legal Info Box: Himoya Orderi */}
      <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3 text-slate-800">
        <h3 className="font-heading font-bold text-base text-emerald-950 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-700" />
          <span>Himoya Orderi Qanday Olinadi?</span>
        </h3>
        <p className="text-xs sm:text-sm font-sans text-emerald-950 leading-relaxed">
          O‘zbekiston Respublikasining 561-sonli Qonuniga muvofiq, tazyiq va zo‘ravonlikdan jabrlangan har bir xotin-qiz profilaktika inspektori yoki «Inson» markazidan <strong>30 kun muddatga</strong> Himoya orderi olish huquqiga ega. Himoya orderi doirasida zo‘ravonga jabrlanuvchi bilan muloqot qilish, uning ish yoki yashash joyiga yaqinlashish taqiqlanadi. Agar xavf bartaraf etilmasa, order muddati 30 kundan 1 yilgacha uzaytirilishi mumkin.
        </p>
      </div>
    </div>
  );
}
