'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Pause, Play, Sparkles } from 'lucide-react';

export interface TestimonialSlide {
  id: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  metric?: string;
  tag?: string;
}

const DEFAULT_SLIDES: TestimonialSlide[] = [
  {
    id: 't-1',
    author: 'Éléonore Moreau',
    role: 'Head of Product',
    company: 'Fintech Vitesse',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote: "Grâce au nouveau Design System et aux grilles Bento interactives, notre temps de mise sur le marché a été divisé par 4. L'expérience de prévisualisation en direct est inégalée.",
    metric: '+320% Conversion',
    tag: 'SaaS Minimaliste'
  },
  {
    id: 't-2',
    author: 'Marc de Saint-Germain',
    role: 'Managing Director',
    company: 'Aureus Wealth Management',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote: "Le thème Dark Luxury Fintech apporte un niveau de crédibilité exceptionnel auprès de nos clients grands comptes. Les animations 3D sont fluides sur tous les écrans.",
    metric: '1.2B$ Actifs Gérés',
    tag: 'Dark Luxury Fintech'
  },
  {
    id: 't-3',
    author: 'Sophie Lin',
    role: 'Lead UX Architect',
    company: 'Studio Nova Paris',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote: "L'explorateur visuel de Google Fonts et la sélection Lucide en temps réel rendent le prototypage ultra ludique. Nos clients adorent pouvoir valider leurs idées en direct.",
    metric: '45+ Projets Livrés',
    tag: 'Portfolio Créatif'
  }
];

export const CarouselSection: React.FC<{
  slides?: TestimonialSlide[];
  title?: string;
  subtitle?: string;
}> = ({
  slides = DEFAULT_SLIDES,
  title = "Témoignages & Avis Clients Interactifs",
  subtitle = "Un carrousel tactile fluide avec contrôle de défilement, jauges d'impact et étoiles de satisfaction."
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-widest">
          <Quote className="w-3.5 h-3.5 text-pink-400" />
          <span>Carrousel Tactile & Slider</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        <p className="text-base text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Slide Card Container */}
      <div className="relative bg-[#0d1220]/90 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl overflow-hidden transition-all">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Author Avatar & Badge */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-indigo-500/40 p-1 bg-slate-900 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSlide.avatar}
                alt={currentSlide.author}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {currentSlide.metric && (
              <span className="mt-3 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold shadow-sm">
                {currentSlide.metric}
              </span>
            )}
          </div>

          {/* Quote Content */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Rating Stars */}
            <div className="flex items-center justify-center md:justify-start gap-1">
              {Array.from({ length: currentSlide.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote Text */}
            <blockquote className="text-lg sm:text-xl font-medium text-slate-100 italic leading-relaxed">
              &ldquo;{currentSlide.quote}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div>
              <p className="text-base font-bold text-white">{currentSlide.author}</p>
              <p className="text-xs text-slate-400">
                {currentSlide.role} — <span className="text-indigo-400 font-semibold">{currentSlide.company}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                title={`Aller à la diapositive ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-8 bg-indigo-500 shadow-lg shadow-indigo-500/30'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Next / Prev Buttons & Autoplay Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              title={isAutoPlaying ? "Mettre en pause l'autodefilement" : "Lancer l'autodefilement"}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoPlaying ? 'Pause' : 'Auto'}</span>
            </button>

            <button
              onClick={handlePrev}
              title="Précédent"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              title="Suivant"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
