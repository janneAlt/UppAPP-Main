"use client";

import { useEffect, useState } from "react";

// Easter egg: open any page with ?demo and, a few seconds later, pink
// elephants dance across the screen. Shown once per browser session.
const START_DELAY_MS = 4000;
const SHOW_MS = 6500;
const SEEN_KEY = "pink-elephants-seen";

const ELEPHANTS = [
  { left: "6%", delay: "0s", size: 110 },
  { left: "24%", delay: "0.25s", size: 90 },
  { left: "42%", delay: "0.1s", size: 130 },
  { left: "62%", delay: "0.35s", size: 95 },
  { left: "80%", delay: "0.15s", size: 115 },
];

export function PinkElephants() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("demo")) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage unavailable (e.g. private mode): just show it.
    }

    const show = setTimeout(() => setVisible(true), START_DELAY_MS);
    const hide = setTimeout(() => setVisible(false), START_DELAY_MS + SHOW_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pink-elephants" aria-hidden="true">
      {ELEPHANTS.map((e, i) => (
        <div key={i} className="pink-elephant" style={{ left: e.left, animationDelay: e.delay }}>
          <Elephant size={e.size} flip={i % 2 === 1} />
        </div>
      ))}
    </div>
  );
}

function Elephant({ size, flip }: { size: number; flip: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <g className="pink-elephant-legs" fill="#e75a9b">
        <rect x="30" y="78" width="13" height="26" rx="5" />
        <rect x="50" y="80" width="13" height="24" rx="5" />
        <rect x="70" y="80" width="13" height="24" rx="5" />
        <rect x="88" y="78" width="13" height="26" rx="5" />
      </g>
      <path d="M100 62 q14 -4 12 12" stroke="#e75a9b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="66" cy="64" rx="40" ry="28" fill="#f47fb4" />
      <circle cx="30" cy="48" r="22" fill="#f47fb4" />
      <ellipse cx="42" cy="46" rx="14" ry="18" fill="#f9a8cf" stroke="#e75a9b" strokeWidth="2" />
      <path d="M12 54 q-8 18 2 30 q4 4 8 0" stroke="#f47fb4" strokeWidth="10" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="42" r="3.5" fill="#3b1830" />
      <path d="M20 62 q5 4 10 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
