"use client";
import React from "react";
import {
  Trophy,
  Truck,
  ShieldCheck,
  BadgePercent,
  Users,
  Package,
  Clock,
  ArrowRight,
  Crown
} from "lucide-react";

/* ================= DATA ================= */

const stats = [
  { value: "50+", label: "Years Experience", icon: Trophy },
  { value: "500+", label: "Hotels Served", icon: Users },
  { value: "10k+", label: "Products Delivered", icon: Package },
  { value: "24/7", label: "Support Ready", icon: Clock },
];

const benefits = [
  {
    title: "Hospitality Specialists",
    desc: "Deep understanding of hotel operations & supply cycles.",
    icon: Crown,
  },
  {
    title: "Lightning Fast Dispatch",
    desc: "Orders processed and shipped within 24 hours.",
    icon: Truck,
  },
  {
    title: "Guaranteed Genuine",
    desc: "Direct manufacturer sourcing only. No duplicates.",
    icon: ShieldCheck,
  },
  {
    title: "Factory Direct Pricing",
    desc: "Bulk-friendly wholesale rates without middlemen.",
    icon: BadgePercent,
  },
];

/* ================= COMPONENT ================= */

export default function WhyChooseUs() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#050505] via-[#0b0b0b] to-[#140202]">

      {/* ===== SOFT BACKGROUND GLOW ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-red-600/20 blur-[120px]" />
        <div className="absolute bottom-[-150px] right-[-120px] w-[500px] h-[500px] bg-red-500/10 blur-[120px]" />
      </div>

      {/* subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-red-400 text-[11px] font-bold tracking-widest uppercase mb-5 backdrop-blur-sm">
            <Trophy className="w-3.5 h-3.5" />
            THE VIJAY ADVANTAGE
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Why Businesses
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
              Trust Us Daily
            </span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            We don’t just supply products — we ensure reliability, speed, and
            cost efficiency for hotels, facilities, and businesses.
          </p>
        </div>

        {/* ================= STATS STRIP ================= */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">

            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6 sm:p-8 text-center transition hover:bg-white/5"
              >
                <div className="mb-3 w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 border border-white/10">
                  <stat.icon className="w-6 h-6 text-red-400" />
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stat.value}
                </div>

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BENEFITS GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">

          {benefits.map((item, i) => (
            <div
              key={i}
              className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.35)]"
            >

              {/* glow hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600/0 to-red-600/20 opacity-0 group-hover:opacity-100 transition" />

              <div className="relative">

                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-400" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.desc}
                </p>

              </div>
            </div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <div className="text-center">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-red-500/40 hover:-translate-y-1 transition">
            Start Your Journey With Us
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
