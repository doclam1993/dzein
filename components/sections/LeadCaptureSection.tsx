'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Lock, ShieldCheck, Mail, User, Building, MessageSquare } from 'lucide-react';

export const LeadCaptureSection: React.FC<{
  title?: string;
  subtitle?: string;
  buttonText?: string;
}> = ({
  title = "Formulaire de Capture de Leads & Contact Intelligent",
  subtitle = "Saisie assistée avec validation en temps réel, retour visuel instantané et sécurité renforcée.",
  buttonText = "Obtenir un Accès Prioritaire"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'saas',
    message: '',
    consent: true
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Email regex validation
  const isEmailValid = Boolean(
    formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  );

  const isNameValid = formData.name.trim().length >= 2;
  const isMessageValid = formData.message.trim().length >= 5;

  const isFormValid = isEmailValid && isNameValid && formData.consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (!isFormValid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-[#0c101c]/90 border border-indigo-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        {/* Decorative Background Accents */}
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Capture de Leads Temps Réel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Success State Screen */}
          {isSuccess ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Demande enregistrée avec succès !</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Un e-mail de confirmation à été envoyé à <strong className="text-emerald-300">{formData.email}</strong>. Notre équipe vous recontactera sous 2 heures.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: '', email: '', company: '', projectType: 'saas', message: '', consent: true });
                  setTouched({ name: false, email: false, message: false });
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-medium text-xs transition-colors"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Nom & Prénom <span className="text-pink-400">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onBlur={() => setTouched({ ...touched, name: true })}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Élodie Bernard"
                      className={`w-full bg-[#080b14] border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                        touched.name && !isNameValid
                          ? 'border-red-500/60 focus:border-red-500'
                          : isNameValid
                          ? 'border-emerald-500/50 focus:border-emerald-500'
                          : 'border-white/10 focus:border-indigo-500/50'
                      }`}
                    />
                    {touched.name && isNameValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {touched.name && !isNameValid && (
                    <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Saisissez au moins 2 caractères.</span>
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Adresse E-mail Professionnelle <span className="text-pink-400">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: elodie@entreprise.fr"
                      className={`w-full bg-[#080b14] border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                        touched.email && !isEmailValid
                          ? 'border-red-500/60 focus:border-red-500'
                          : isEmailValid
                          ? 'border-emerald-500/50 focus:border-emerald-500'
                          : 'border-white/10 focus:border-indigo-500/50'
                      }`}
                    />
                    {touched.email && isEmailValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {touched.email && !isEmailValid && (
                    <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Veuillez entrer une adresse e-mail valide.</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Company & Category Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Entreprise / Organisation</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ex: Acme Studio"
                    className="w-full bg-[#080b14] border border-white/10 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Catégorie de Projet</span>
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#080b14] border border-white/10 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none transition-all"
                  >
                    <option value="saas">SaaS Minimaliste</option>
                    <option value="fintech">Dark Luxury Fintech</option>
                    <option value="portfolio">Portfolio Créatif</option>
                    <option value="ecommerce">E-commerce Modern Store</option>
                    <option value="mobile">App Mobile Showcase</option>
                  </select>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Détails du projet ou objectifs</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez brièvement vos attentes ou le type de composants recherché..."
                  className="w-full bg-[#080b14] border border-white/10 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="lead-consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="rounded border-white/10 bg-[#080b14] text-indigo-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="lead-consent" className="text-xs text-slate-400 cursor-pointer select-none">
                  J&apos;accepte la politique de confidentialité & le traitement sécurisé de mes données.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isFormValid
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-indigo-500/25 cursor-pointer hover:scale-[1.01]'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{buttonText}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1 pt-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Données chiffrées de bout en bout • Aucun spam garanti</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
