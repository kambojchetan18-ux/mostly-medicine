"use client";

import { useEffect, useState } from "react";

// ----------------------------------------------------------------------
// Browser type augmentation — beforeinstallprompt is non-standard but
// supported on Chrome/Edge/Samsung Internet/Brave on Android + desktop.
// We fire-store the event and call prompt() on user click, which is the
// only way Chrome will surface the native install dialog post-engagement.
// ----------------------------------------------------------------------
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "mm_pwa_install_dismissed_at";
const DISMISS_TTL_DAYS = 14; // re-show banner two weeks after dismiss

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in window) &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 0
  );
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS-specific
  const navWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  if (navWithStandalone.standalone === true) return true;
  // Other browsers
  return window.matchMedia("(display-mode: standalone)").matches;
}

function dismissedRecently(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = Number.parseInt(raw, 10);
  if (!Number.isFinite(ts)) return false;
  const days = (Date.now() - ts) / (1000 * 60 * 60 * 24);
  return days < DISMISS_TTL_DAYS;
}

export default function InstallPwaBanner(): JSX.Element | null {
  const [showBanner, setShowBanner] = useState(false);
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"ios" | "android-chrome" | "other" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return; // already installed
    if (dismissedRecently()) return;

    if (isIOS()) {
      setPlatform("ios");
      setShowBanner(true);
      return;
    }

    // Chromium-based: wait for beforeinstallprompt
    const handler = (e: Event) => {
      // Stop the browser's own UI; we'll trigger via our button.
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPlatform("android-chrome");
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // If user installs via browser UI directly, hide banner.
    const installedHandler = () => {
      setShowBanner(false);
      setShowIosSheet(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  function dismiss(): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setShowBanner(false);
    setShowIosSheet(false);
  }

  async function handleInstallClick(): Promise<void> {
    if (platform === "ios") {
      setShowIosSheet(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }

  if (!showBanner) return null;

  return (
    <>
      {/* Slim banner */}
      <div className="relative z-30 flex items-center gap-3 border-b border-emerald-800/40 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-violet-950/60 px-4 py-2.5 text-sm">
        <span className="text-base shrink-0" aria-hidden>📲</span>
        <p className="flex-1 text-slate-200 leading-snug">
          <span className="font-semibold text-white">Install Mostly Medicine</span>{" "}
          <span className="hidden sm:inline text-slate-400">— no Play Store, no App Store, free forever. Open it like a native app.</span>
          <span className="sm:hidden text-slate-400">— like a native app, no store needed.</span>
        </p>
        <button
          type="button"
          onClick={handleInstallClick}
          className="shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs px-3 py-1.5 transition"
        >
          {platform === "ios" ? "How to install" : "Install"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install banner"
          className="shrink-0 rounded-md text-slate-500 hover:text-slate-200 transition px-1.5 py-1"
        >
          ✕
        </button>
      </div>

      {/* iOS-specific instructions sheet */}
      {showIosSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="iOS install instructions"
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-200 transition text-xl leading-none"
            >
              ✕
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-3">
              Install on iPhone / iPad
            </p>
            <h2 className="font-display font-bold text-white text-xl mb-3 leading-tight">
              Add Mostly Medicine to your Home Screen
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              iOS doesn&apos;t auto-prompt apps from the web (Apple-only quirk). Two taps and you&apos;re done:
            </p>
            <ol className="space-y-4 mb-5">
              <li className="flex gap-3">
                <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold">
                  1
                </span>
                <div className="flex-1 text-sm text-slate-200 leading-relaxed">
                  Tap the <strong>Share button</strong>{" "}
                  <span
                    className="inline-block align-middle mx-1 rounded-md border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[11px] font-mono text-slate-300"
                    aria-label="Share icon"
                  >
                    ⬆︎
                  </span>{" "}
                  in your Safari toolbar (bottom of screen)
                </div>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold">
                  2
                </span>
                <div className="flex-1 text-sm text-slate-200 leading-relaxed">
                  Scroll down and tap <strong>Add to Home Screen</strong>{" "}
                  <span className="inline-block align-middle mx-1 text-slate-500">➕</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold">
                  3
                </span>
                <div className="flex-1 text-sm text-slate-200 leading-relaxed">
                  Tap <strong>Add</strong> — the brand &ldquo;M&rdquo; icon appears on your home screen.
                </div>
              </li>
            </ol>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              You&apos;ll get the same look-and-feel as a native app: launches full-screen, dark splash, no browser bar. Free forever, no app store account needed.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-4 py-2.5 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
