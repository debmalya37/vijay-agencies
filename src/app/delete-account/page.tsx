// File: app/delete-account/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldCheck, UserX } from "lucide-react";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Optional: Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/profile"); // Adjust this path if your profile page URL is different
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <UserX className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Deletion</h1>
          <p className="text-slate-600 text-sm">
            Request to permanently delete your account and associated data.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">
                For security reasons and to verify your identity, account deletion must be performed from within your authenticated profile dashboard.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">
                Please note that deleting your account is irreversible. All your personal data, order history, and saved preferences will be permanently erased.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 mb-4">
              Redirecting to your profile settings in <span className="font-bold text-slate-700">{countdown}s</span>...
            </p>
            
            <Link 
              href="/profile" 
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
            >
              Go to Profile Settings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}