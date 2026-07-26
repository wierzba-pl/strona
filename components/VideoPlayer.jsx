"use client";

import {
  Maximize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function VideoPlayer({
  src,
  title = "Wideo",
  poster,
  className = "",
  aspect = "aspect-[4/5]"
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    video.muted = true;
    video.volume = volume;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => {
      setPlaying(!video.paused);
      setMuted(video.muted);
      setProgress(video.currentTime);
      setDuration(video.duration || 0);
    };

    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    video.addEventListener("timeupdate", sync);
    video.addEventListener("loadedmetadata", sync);
    video.addEventListener("volumechange", sync);

    return () => {
      video.removeEventListener("play", sync);
      video.removeEventListener("pause", sync);
      video.removeEventListener("timeupdate", sync);
      video.removeEventListener("loadedmetadata", sync);
      video.removeEventListener("volumechange", sync);
    };
  }, []);

  const unlockSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = volume;
    video.play().catch(() => undefined);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.paused) video.play().catch(() => undefined);
  };

  const seek = (event) => {
    const video = videoRef.current;
    if (!video) return;
    const value = Number(event.target.value);
    video.currentTime = value;
    setProgress(value);
  };

  const changeVolume = (event) => {
    const video = videoRef.current;
    const value = Number(event.target.value);
    setVolume(value);
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
  };

  const fullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    video.requestFullscreen?.();
  };

  if (!src) {
    return (
      <div
        className={`media-frame ${aspect} ${className} flex items-center justify-center p-6 text-center font-mono text-xs uppercase tracking-[0.08em] text-white/45`}
      >
        TODO: dodać link wideo w Notion / Cloudflare R2
      </div>
    );
  }

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.55 ? Volume1 : Volume2;

  return (
    <div className={`group media-frame ${aspect} ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
        onClick={unlockSound}
      />
      <button
        type="button"
        onClick={unlockSound}
        className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity ${
          muted ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Włącz dźwięk"
      >
        <span className="rounded-full bg-paper px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink shadow">
          Kliknij, żeby włączyć dźwięk
        </span>
      </button>
      <div className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-2 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={Math.min(progress, duration || progress)}
          onChange={seek}
          className="h-1 w-full accent-[#D4291B]"
          aria-label="Pasek postępu wideo"
        />
        <div className="flex items-center gap-3 text-paper">
          <button type="button" onClick={togglePlay} aria-label={playing ? "Pauza" : "Odtwórz"}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Włącz dźwięk" : "Wycisz"}>
            <VolumeIcon size={18} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={changeVolume}
            className="w-24 accent-[#D4291B]"
            aria-label="Głośność"
          />
          <button type="button" onClick={fullscreen} className="ml-auto" aria-label="Pełny ekran">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
