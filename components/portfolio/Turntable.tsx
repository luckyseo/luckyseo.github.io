"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const RPM = 33.3;
const TARGET_DPS = RPM * 6;

export function Turntable() {
  const [playing, setPlaying] = useState(false);
  const [angle, setAngle] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const velocityRef = useRef(0);
  const angleRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const target = playing ? TARGET_DPS : 0;
      const drag = playing ? 2.6 : 1.1;
      velocityRef.current += (target - velocityRef.current) * Math.min(dt * drag, 1);

      if (!playing && Math.abs(velocityRef.current) < 1.2) {
        velocityRef.current = 0;
      }

      angleRef.current = (angleRef.current + velocityRef.current * dt) % 360;
      setAngle(angleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [playing]);

  async function togglePlaying() {
    const nextPlaying = !playing;
    setPlaying(nextPlaying);

    if (!audioRef.current) return;

    if (nextPlaying) {
      try {
        await audioRef.current.play();
      } catch {
        // The visual turntable still works before a real audio file is added.
      }
    } else {
      audioRef.current.pause();
    }
  }

  return (
    <aside className="now-card" aria-label="Now playing">
      <button
        className={cn("turntable", playing && "turntable--playing turntable--spinning")}
        type="button"
        aria-pressed={playing}
        aria-label={playing ? "Stop the record" : "Play the record"}
        onClick={togglePlaying}
      >
        <span className="turntable__tonearm" aria-hidden>
          <span className="turntable__needle" />
          <span className="turntable__head" />
        </span>
        <span className="record" aria-hidden>
          <span className="record__disc" style={{ transform: `rotate(${angle}deg)` }}>
            <span className="record__sheen" />
            <span className="record__label" />
          </span>
        </span>
        <span className="turntable__hint">{playing ? "Tap to stop" : "Tap to play"}</span>
      </button>
      <h2>Album or track title</h2>
      <p>Artist name</p>
      <audio ref={audioRef} src="/audio/now-playing.mp3" loop preload="none" />
    </aside>
  );
}
