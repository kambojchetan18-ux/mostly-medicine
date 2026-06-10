"use client";

interface Props {
  muted: boolean;
  volume: number;
  setMuted: (m: boolean) => void;
  setVolume: (v: number) => void;
  ttsSupported: boolean;
}

// Inline mute toggle + volume slider for AI voice. Uses tts settings
// persisted in localStorage by useSpeechSynthesis. Renders nothing if the
// browser has no TTS support.
export default function VoiceControls({ muted, volume, setMuted, setVolume, ttsSupported }: Props) {
  if (!ttsSupported) return null;
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        title={muted ? "Unmute AI voice" : "Mute AI voice"}
        className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
          muted
            ? "border-gray-300 bg-gray-100 text-gray-500"
            : "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100"
        }`}
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        disabled={muted}
        title={`Volume ${Math.round(volume * 100)}%`}
        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-fuchsia-600 disabled:opacity-50"
      />
    </div>
  );
}
