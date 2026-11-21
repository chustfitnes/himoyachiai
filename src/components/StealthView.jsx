import React, { useState } from 'react';
import { Utensils, Search, Clock, Users, ChevronRight, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

const RECIPES = [
  {
    id: 1,
    title: "Toshkentcha To'y Oshi",
    category: "Issiq taomlar",
    time: "90 daqiqa",
    servings: "6 kishilik",
    desc: "Yumshoq go'sht, no‘xat va mayiz bilan tayyorlanadigan milliy to‘y oshi retsepti.",
    ingredients: [
      "1 kg guruch (Lazer yoki Alanga)",
      "1 kg mol yoki qo'y go'shti",
      "1 kg qizil va sariq sabzi",
      "200 g dumba yog'i yoki o'simlik yog'i",
      "100 g ivitilgan no'xat",
      "50 g mayiz, zira, murch, tuz",
    ],
    steps: [
      "Qozonni qizdirib, yog'ni dog'lang va go'shtni tillarang bo'lguncha qovuring.",
      "Piyozni qo'shib qovuring, so'ng somoncha to'g'ralgan sabzini soling.",
      "Suv quyib, no'xat va ziravorlarni solib past olovda 40 daqiqa mildirating.",
      "Yuvilgan guruchni tekis solib, suvini tortguncha pishiring va 20 daqiqa damlang.",
    ],
  },
  {
    id: 2,
    title: "Qatlama Uy Somsasi",
    category: "Pishiriqlar",
    time: "60 daqiqa",
    servings: "12 dona",
    desc: "Qarsildoq qat-qat xamirdan tayyorlanadigan an'anaviy tandirbop somsalar.",
    ingredients: [
      "500 g un, 1 stakan iliq suv, 1 choy qoshiq tuz",
      "150 g eritilgan sariyog' yoki margarin",
      "400 g mayda to'g'ralgan go'sht va dumba",
      "3 dona piyoz, zira, qora murch",
    ],
    steps: [
      "Oddiy o'rtacha xamir qoring va 20 daqiqa tindiring.",
      "Yupqa qilib yoyib, eritilgan sariyog' surting va rulet shaklida o'rang.",
      "Muzlatgichda 30 daqiqa qotgach, bo'laklarga bo'lib ichiga qiyma soling.",
      "200 daraja qizigan duxovkada 35-40 daqiqa qizarguncha pishiring.",
    ],
  },
  {
    id: 3,
    title: "Tez Tayyor Bo'ladigan Olmali Pirog (Sharlotka)",
    category: "Desertlar",
    time: "40 daqiqa",
    servings: "8 kishilik",
    desc: "Har bir xonadonda topiladigan oddiy masalliqlardan eng nozik choybop shirinlik.",
    ingredients: [
      "4 dona tuxum",
      "1 stakan shakar",
      "1 stakan un",
      "3 dona shirin-nordon olma",
      "Vanilin va qabartma (razrixlitel)",
    ],
    steps: [
      "Tuxumni shakar bilan oppoq ko'puk bo'lguncha mikserda ko'pirtiring.",
      "Elangan un va qabartmani asta-sekin qoshiqda aralashtiring.",
      "Yupqa to'g'ralgan olmalarni qolipga terib, ustidan xamirni quying.",
      "180 darajada 30-35 daqiqa davomida tillarang bo'lguncha pishiring.",
    ],
  },
];

export default function StealthView() {
  const { toggleStealthMode } = useAssessment();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  const categories = ['Barchasi', 'Issiq taomlar', 'Pishiriqlar', 'Desertlar'];

  const filtered = RECIPES.filter((r) => {
    const matchCat = selectedCategory === 'Barchasi' || r.category === selectedCategory;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2825] font-sans">
      {/* Camouflage Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#EAE3D9] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight block leading-none">
                Oshxona Sirlari
              </span>
              <span className="text-[10px] text-[#8C827A] leading-none">
                Kundalik pishiriqlar va taomlar
              </span>
            </div>
          </div>

          {/* Discreet Exit Button back to HimoyaAI */}
          <button
            onClick={toggleStealthMode}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-[#F4EFEB] hover:bg-[#EBE2DA] text-[#6A6057] transition-colors border border-[#DDD5CA]"
            title="Asosiy sahifaga qaytish"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Qaydlarimga qaytish</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {selectedRecipe ? (
          /* Recipe Detail View */
          <div className="space-y-6 animate-fadeIn">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="inline-flex items-center gap-1 text-xs text-[#8C827A] hover:text-[#2C2825]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Barcha retseptlarga qaytish</span>
            </button>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                {selectedRecipe.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-2 text-[#2C2825]">
                {selectedRecipe.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-[#8C827A] mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedRecipe.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {selectedRecipe.servings}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] space-y-3">
              <h2 className="font-serif font-bold text-base text-[#2C2825]">
                Kerakli masalliqlar:
              </h2>
              <ul className="space-y-1.5 text-sm text-[#544D46]">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] space-y-3">
              <h2 className="font-serif font-bold text-base text-[#2C2825]">
                Tayyorlash bosqichlari:
              </h2>
              <ol className="space-y-3 text-sm text-[#544D46]">
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          /* Recipe List & Search View */
          <>
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2C2825]">
                Har kungi mazali retseptlar to‘plami
              </h1>
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Taom yoki pishiriq nomini qidiring..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DDD5CA] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 placeholder:text-[#AAA096]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-800 text-white'
                        : 'bg-white border border-[#EAE3D9] text-[#6A6057] hover:bg-[#F4EFEB]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe Cards */}
            <div className="grid grid-cols-1 gap-3.5">
              {filtered.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="p-4 rounded-2xl bg-white border border-[#EAE3D9] hover:border-amber-300 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                        {recipe.category}
                      </span>
                      <h2 className="font-serif font-bold text-base text-[#2C2825] mt-0.5">
                        {recipe.title}
                      </h2>
                      <p className="text-xs text-[#7A7066] mt-1 line-clamp-2 leading-relaxed">
                        {recipe.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#AAA096] shrink-0 mt-2" />
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-[#8C827A] mt-3 pt-2.5 border-t border-[#F4EFEB]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {recipe.servings}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Camouflage Footer */}
      <footer className="mt-12 py-6 border-t border-[#EAE3D9] text-center text-xs text-[#8C827A]">
        <p>© 2026 Oshxona Sirlari — Uy bekalari uchun bepul pazandalik qaydlari</p>
      </footer>
    </div>
  );
}
