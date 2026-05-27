"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { FaCoins, FaCheck, FaSpinner, FaArrowRight, FaGoogle } from "react-icons/fa";

const PLANS = [
  {
    id: "basic",
    name: "Basic Pack",
    credits: 1000,
    price: "$5",
    desc: "Great for testing out custom hairstyles",
    features: [
      "~55 Hairstyle Simulations",
      "Interactive Before/After View",
      "High-Resolution Image Downloads",
      "Private Workspace Gallery",
      "Standard Generation Speed"
    ]
  },
  {
    id: "standard",
    name: "Standard Pack",
    credits: 2000,
    price: "$10",
    desc: "Perfect for fashion-forward people",
    features: [
      "~111 Hairstyle Simulations",
      "Interactive Before/After View",
      "High-Resolution Image Downloads",
      "Private Workspace Gallery",
      "Priority Queue Speeds"
    ]
  },
  {
    id: "pro",
    name: "Professional Pack",
    credits: 4000,
    price: "$20",
    desc: "Ideal for salon styling & creators",
    popular: true,
    features: [
      "~222 Hairstyle Simulations",
      "Unlimited Style History",
      "Interactive Before/After View",
      "Priority Queue Speeds",
      "High-Resolution Image Downloads",
      "Premium Email Support"
    ]
  },
  {
    id: "business",
    name: "Business Pack",
    credits: 10000,
    price: "$50",
    desc: "For styling brands and studio teams",
    features: [
      "~555 Hairstyle Simulations",
      "Commercial Usage License",
      "Instant Cloud Generation Speeds",
      "Priority 24/7 Dedicated Support",
      "Advanced Custom Tuning Options",
      "Interactive Before/After View"
    ]
  }
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [success, setSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success")) setSuccess(true);
      if (params.get("canceled")) setCanceled(true);
    }
  }, []);

  const handlePurchase = async (planId) => {
    if (!session?.user) { signIn("google"); return; }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.url) window.location.href = d.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-black uppercase tracking-wider text-violet-400 bg-violet-950/40 border border-violet-700 px-3.5 py-1.5 rounded-full shadow-sm">
            Credit Packages
          </span>
          <h1 className="text-3xl font-black font-heading text-white tracking-tight mt-4">
            Simple, Transparent Hair Styling
          </h1>
          <p className="text-sm text-zinc-300 mt-2 font-medium">
            Buy one-time credits. No monthly subscriptions, use them whenever you need. Each hairstyle simulation costs <strong className="text-violet-400">18 credits</strong>.
          </p>
        </div>

        {/* Transaction Alerts */}
        {success && (
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-6 mb-8 text-center max-w-xl mx-auto shadow-lg animate-in fade-in zoom-in duration-200">
            <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
              <FaCheck className="text-sm" />
            </div>
            <h3 className="text-sm font-bold text-emerald-300">Purchase Successful!</h3>
            <p className="text-xs text-emerald-300/80 leading-relaxed mt-1 max-w-sm mx-auto">
              Your credits have been added successfully to your account. Return to the studio to try new hairstyles!
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="mt-4 inline-flex items-center gap-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md hover:scale-[1.02]"
            >
              Go to Studio <FaArrowRight className="text-[9px]" />
            </button>
          </div>
        )}

        {canceled && (
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-4 mb-8 text-center max-w-xl mx-auto shadow-lg animate-in fade-in zoom-in duration-200">
            <h3 className="text-sm font-bold text-amber-300 font-heading">Transaction Canceled</h3>
            <p className="text-xs text-amber-200 mt-1 font-medium">
              The Stripe checkout session was canceled. No charges were made to your account.
            </p>
          </div>
        )}

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => {
            const isLoading = loadingPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`bg-zinc-900 border rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-lg transition-all hover:border-zinc-500 hover:scale-[1.01] relative ${
                  plan.popular
                    ? "border-violet-500 ring-2 ring-violet-500/10 scale-[1.02] z-10"
                    : "border-zinc-800"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-955 border border-violet-750 px-2.5 py-0.5 rounded shadow">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider">{plan.name}</h3>
                  <p className="text-[11px] text-zinc-300 font-bold mt-1.5 leading-snug">{plan.desc}</p>
                  
                  {/* Big price display */}
                  <div className="flex items-baseline gap-1 my-5">
                    <span className="text-3xl font-black text-white font-heading">{plan.price}</span>
                    <span className="text-xs text-zinc-400 font-bold">one-time</span>
                  </div>

                  {/* Feature lists */}
                  <ul className="space-y-2.5 text-xs text-zinc-200 mb-6 font-medium">
                    <li className="flex items-center gap-2 text-violet-300 font-bold bg-violet-950/40 border border-violet-900/50 px-2.5 py-1.5 rounded-lg mb-4">
                      <FaCoins className="text-amber-405 text-xs animate-pulse" />
                      <span>{plan.credits} Credits</span>
                    </li>
                    
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <FaCheck className="text-violet-400 text-[10px] flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-violet-500/10 hover:scale-[1.01]"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
                  }`}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-xs text-white" />
                  ) : !session?.user ? (
                    <>
                      <FaGoogle className="text-[10px]" />
                      <span>Sign in to Purchase</span>
                    </>
                  ) : (
                    <span>Get {plan.credits} Credits</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
