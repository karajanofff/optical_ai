export function OpticalHeroIllustration() {
  return (
    <div className="mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/40 p-6 shadow-premium">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Optik topologiya</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Tolali tarmoq monitoring xaritasi</h3>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
          Jonli oqim
        </div>
      </div>

      <svg viewBox="0 0 720 420" className="w-full">
        <defs>
          <linearGradient id="fiberStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="panelFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(15,23,42,0.9)" />
            <stop offset="100%" stopColor="rgba(30,41,59,0.35)" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="720" height="420" rx="28" fill="url(#panelFill)" />

        <circle cx="150" cy="120" r="18" fill="#2dd4bf" filter="url(#softGlow)" />
        <circle cx="330" cy="80" r="16" fill="#38bdf8" filter="url(#softGlow)" />
        <circle cx="520" cy="140" r="20" fill="#2dd4bf" filter="url(#softGlow)" />
        <circle cx="610" cy="300" r="18" fill="#f59e0b" filter="url(#softGlow)" />
        <circle cx="390" cy="320" r="18" fill="#38bdf8" filter="url(#softGlow)" />
        <circle cx="170" cy="300" r="20" fill="#ef4444" filter="url(#softGlow)" />

        <path d="M150 120 C 210 90, 260 70, 330 80" fill="none" stroke="url(#fiberStroke)" strokeWidth="6" strokeLinecap="round" />
        <path d="M330 80 C 400 95, 455 105, 520 140" fill="none" stroke="url(#fiberStroke)" strokeWidth="6" strokeLinecap="round" />
        <path d="M520 140 C 585 175, 620 225, 610 300" fill="none" stroke="url(#fiberStroke)" strokeWidth="6" strokeLinecap="round" />
        <path d="M520 140 C 470 210, 430 250, 390 320" fill="none" stroke="url(#fiberStroke)" strokeWidth="6" strokeLinecap="round" />
        <path d="M390 320 C 300 340, 250 330, 170 300" fill="none" stroke="url(#fiberStroke)" strokeWidth="6" strokeLinecap="round" />
        <path d="M170 300 C 140 250, 130 195, 150 120" fill="none" stroke="url(#fiberStroke)" strokeWidth="6" strokeLinecap="round" />

        <g>
          <rect x="55" y="54" width="145" height="52" rx="18" fill="rgba(8,47,73,0.92)" stroke="rgba(45,212,191,0.35)" />
          <text x="78" y="84" fill="#d1fae5" fontSize="18" fontWeight="600">Core OLT</text>
          <text x="78" y="101" fill="#94a3b8" fontSize="12">Signal: -17.4 dBm</text>
        </g>

        <g>
          <rect x="285" y="22" width="160" height="58" rx="18" fill="rgba(8,47,73,0.92)" stroke="rgba(96,165,250,0.35)" />
          <text x="310" y="52" fill="#dbeafe" fontSize="18" fontWeight="600">Metro Switch</text>
          <text x="310" y="70" fill="#94a3b8" fontSize="12">Latency: 3.2 ms</text>
        </g>

        <g>
          <rect x="474" y="38" width="168" height="58" rx="18" fill="rgba(8,47,73,0.92)" stroke="rgba(45,212,191,0.35)" />
          <text x="500" y="68" fill="#d1fae5" fontSize="18" fontWeight="600">Distribution ONU</text>
          <text x="500" y="86" fill="#94a3b8" fontSize="12">Traffic: 624 Mbps</text>
        </g>

        <g>
          <rect x="502" y="324" width="170" height="58" rx="18" fill="rgba(69,10,10,0.92)" stroke="rgba(248,113,113,0.4)" />
          <text x="528" y="354" fill="#fee2e2" fontSize="18" fontWeight="600">Alert Segment</text>
          <text x="528" y="372" fill="#fca5a5" fontSize="12">Packet loss: 4.8%</text>
        </g>

        <g>
          <rect x="316" y="338" width="150" height="52" rx="18" fill="rgba(8,47,73,0.92)" stroke="rgba(96,165,250,0.35)" />
          <text x="340" y="368" fill="#dbeafe" fontSize="18" fontWeight="600">Edge Panel</text>
          <text x="340" y="385" fill="#94a3b8" fontSize="12">Temp: 41 C</text>
        </g>

        <g>
          <rect x="65" y="326" width="170" height="58" rx="18" fill="rgba(69,10,10,0.92)" stroke="rgba(245,158,11,0.45)" />
          <text x="90" y="356" fill="#ffedd5" fontSize="18" fontWeight="600">Warning Node</text>
          <text x="90" y="374" fill="#fdba74" fontSize="12">AI holati: Ogohlantirish</text>
        </g>

        <g opacity="0.95">
          <rect x="250" y="150" width="220" height="110" rx="26" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.08)" />
          <text x="278" y="186" fill="#e2e8f0" fontSize="16" fontWeight="700">AI tahlil paneli</text>
          <text x="278" y="214" fill="#94a3b8" fontSize="12">Anomaliya ehtimoli</text>
          <rect x="278" y="226" width="160" height="10" rx="999" fill="rgba(255,255,255,0.08)" />
          <rect x="278" y="226" width="118" height="10" rx="999" fill="#2dd4bf" />
          <text x="450" y="235" fill="#e2e8f0" fontSize="12">74%</text>
          <text x="278" y="262" fill="#94a3b8" fontSize="12">Nosozlik bashorati</text>
          <rect x="278" y="274" width="160" height="10" rx="999" fill="rgba(255,255,255,0.08)" />
          <rect x="278" y="274" width="92" height="10" rx="999" fill="#f59e0b" />
          <text x="450" y="283" fill="#e2e8f0" fontSize="12">58%</text>
        </g>
      </svg>
    </div>
  );
}
