// Short trust section — names the co-founders, surfaces the Sydney
// build location, and quietly signals AU PR / clinical currency. This
// replaces the v2 "Built by IMGs" mantra marquee with one premium
// editorial card.

export default function BuiltForIMGs() {
  return (
    <section className="bg-cream-100/40 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-[2rem] bg-ink-950 text-cream-50 shadow-[0_40px_80px_-40px_rgba(8,8,11,0.4)]">
          <div className="grid items-stretch gap-0 lg:grid-cols-[1.1fr_1fr]">
            {/* LEFT — copy */}
            <div className="px-7 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-400">
                Built for IMGs, by IMGs
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-cream-50 sm:text-4xl">
                We sat the same exam.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-cream-50/75 sm:text-lg">
                Mostly Medicine is built by a small team of International Medical Graduates and IT
                professionals in Sydney. AMC pass-graduates on the team shape every clinical case;
                engineers ship the platform around them.
              </p>
              <p className="mt-5 text-sm text-cream-50/65">
                We&rsquo;re not affiliated with the AMC, AHPRA or any official body. We&rsquo;re an
                independent study tool, aligned with the public AMC Handbook 2026 and Australian
                clinical guidelines.
              </p>
            </div>

            {/* RIGHT — credential card */}
            <div className="relative flex flex-col justify-center gap-5 border-t border-cream-50/10 bg-ink-900 px-7 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0">
              <Credential
                figure="2026"
                label="AMC Handbook edition"
                detail="151 cases aligned + unlimited Beyond"
              />
              <Credential
                figure="Sydney"
                label="Where it&rsquo;s built"
                detail="Same time zone you&rsquo;ll work in"
              />
              <Credential
                figure="100%"
                label="AU clinical guidelines"
                detail="No US-tuned content"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Credential({ figure, label, detail }: { figure: string; label: string; detail: string }) {
  return (
    <div className="border-l-2 border-saffron-500 pl-4">
      <p className="font-display text-2xl font-extrabold tracking-tight text-cream-50 sm:text-3xl">
        {figure}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-cream-50/90">{label}</p>
      <p className="text-xs text-cream-50/55">{detail}</p>
    </div>
  );
}
