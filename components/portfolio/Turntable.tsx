"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const RPM = 33.3;
const TARGET_DPS = RPM * 6;
const YOUTUBE_VIDEO_ID = "SCl9CL9vqa4";

type YouTubeWindow = typeof window & {
  YT?: { Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayer };
  onYouTubeIframeAPIReady?: () => void;
};

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

export function Turntable() {
  const [playing, setPlaying] = useState(false);
  const [angle, setAngle] = useState(0);
  const ytMountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
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

  useEffect(() => {
    const win = window as YouTubeWindow;

    function createPlayer() {
      if (!ytMountRef.current || !win.YT) return;

      playerRef.current = new win.YT.Player(ytMountRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          modestbranding: 1,
          rel: 0,
        },
      });
    }

    if (win.YT?.Player) {
      createPlayer();
    } else {
      const previousCallback = win.onYouTubeIframeAPIReady;

      win.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  function togglePlaying() {
    const nextPlaying = !playing;
    setPlaying(nextPlaying);

    if (nextPlaying) {
      playerRef.current?.playVideo();
    } else {
      playerRef.current?.pauseVideo();
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
      <h2>Fallen Angel</h2>
      <p>Jennie</p>
      <div ref={ytMountRef} className="turntable__yt-mount" aria-hidden />
    </aside>
  );
}
