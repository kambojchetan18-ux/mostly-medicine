"use client";
import { createAvatar } from "@dicebear/core";
// In Dicebear v9 a "style" is the whole namespace { create, meta, schema },
// not just the `create` function. Importing `{ create as avataaars }` gave
// us a bare function that `createAvatar` then crashed on at runtime with
// "l.create is not a function" — it expects style.create(options) and we
// were passing the unwrapped create. Use a namespace import so the whole
// module object is forwarded.
import * as avataaars from "@dicebear/avataaars";
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
    // Style-specific options (hairColor / accessoriesProbability /
    // facialHairProbability) live on the avataaars style's own schema,
    // not on @dicebear/core's generic Options interface. Cast through
    // `Parameters` since the core typing doesn't surface style overrides.
    const greyHair = persona.age != null && persona.age >= 60;
    const styleOpts: Record<string, unknown> = {
      seed: persona.avatarSeed,
      size,
      hairColor: greyHair
        ? ["gray", "silverGray", "auburn", "black"]
        : persona.age != null && persona.age < 25
          ? ["black", "brown", "brownDark"]
          : undefined,
      accessoriesProbability: persona.age != null && persona.age >= 55 ? 60 : 15,
      facialHairProbability:
        persona.sex === "male" && persona.age != null && persona.age >= 30 ? 40 : 5,
    };
    // Dicebear v9's core type expects `Style<{}>` but each collection style
    // narrows the option shape to its own schema. The runtime is happy with
    // a plain object — cast through unknown to satisfy the compiler.
    return createAvatar(
      avataaars as unknown as Parameters<typeof createAvatar>[0],
      styleOpts as Parameters<typeof createAvatar>[1]
    ).toDataUri();
  }, [persona.avatarSeed, persona.sex, persona.age, size]);

  return (
    <div
      className={[
        "relative inline-block overflow-hidden",
        background ? "bg-emerald-50" : "",
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
