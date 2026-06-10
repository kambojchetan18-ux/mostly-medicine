"use client";
import { createAvatar } from "@dicebear/core";
// Dicebear v9 style packages export { create, meta, schema } as the whole
// namespace — pass the namespace object, not the `create` function alone.
//
// Why `personas` instead of `avataaars`: avataaars renders an exaggerated
// cartoon vibe that users on a high-stakes AMC clinical exam UI read as
// "childish / fun toy", not "patient". The personas style is a modern
// illustrated adult portrait (rounded but realistic proportions, no
// oversized eyes, neutral clothing) which reads as a professional medical
// illustration rather than a cartoon.
import * as personas from "@dicebear/personas";
import { useMemo } from "react";
import type { PatientPersona } from "@/lib/patientPersona";

interface Props {
  persona: Pick<PatientPersona, "avatarSeed" | "sex" | "age" | "firstName">;
  /** Pixel size — keep ≤256 to avoid laggy initial renders. Default 96. */
  size?: number;
  /** Optional Tailwind classes for the outer wrapper. */
  className?: string;
  /** Show a soft circular background colour behind the avatar. */
  background?: boolean;
}

// Deterministic per-persona Dicebear avatar.
//
// Why client-side render: @dicebear/core generates SVG synchronously from
// the seed — no network call, no per-request cost. Memoised so re-renders
// (e.g. typing on a search bar) don't re-build the SVG string. The avatar
// component itself is < 1 KB markup.
//
// Why avataaars vs personas vs micah:
//   - avataaars closest matches the Neural Consult reference UX and has
//     the widest demographic coverage (skin tones, hair styles, age cues
//     via grey hair / glasses options that we modulate from `age`).
//   - personas is more illustrated but visually flatter; users perceive
//     it as "graphic" rather than "person".
//
// Notes on options:
//   - clothesColor + topType + accessoriesType are driven by the seed via
//     Dicebear's own deterministic picker — we don't pass them.
//   - We bias hairColor / facialHair / accessories with age + sex so an
//     80-year-old man has white hair and glasses more often than a
//     25-year-old. This is a soft visual cue, not a strict mapping.
export default function PatientAvatar({ persona, size = 96, className, background = true }: Props) {
  const dataUri = useMemo(() => {
    // The personas style has its own option schema (hair, body, nose,
    // mouth, eyes). We only need seed-based variation here — the seed
    // alone produces a stable, demographically diverse pool of adult
    // portraits. Keep the options minimal so we don't fight Dicebear's
    // typing per release.
    const styleOpts: Record<string, unknown> = {
      seed: persona.avatarSeed,
      size,
    };
    return createAvatar(
      personas as unknown as Parameters<typeof createAvatar>[0],
      styleOpts as Parameters<typeof createAvatar>[1]
    ).toDataUri();
  }, [persona.avatarSeed, size]);

  return (
    <div
      className={[
        "relative inline-block overflow-hidden",
        background ? "bg-saffron-50" : "",
        className ?? "",
      ].join(" ")}
      style={{ width: size, height: size, borderRadius: "9999px" }}
      aria-label={`Avatar for ${persona.firstName}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUri} alt="" width={size} height={size} draggable={false} />
    </div>
  );
}
