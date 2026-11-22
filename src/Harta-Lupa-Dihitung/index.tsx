import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CoverFrame, ShareProps } from "../shared/CoverFrame";
import { BrandOutro } from "./BrandOutro";
import { HartaLupaCoverInstagram } from "./Covers";
import { SceneDua, SceneHook, SceneLainnya, ScenePenjualan, ScenePiutang, SceneUang } from "./Scenes1";
import { SceneBarang, SceneCta, SceneDiMuka, SceneJaminan, SceneNeraca, ScenePeringatan, SceneUangMuka } from "./Scenes2";
import { C, clamp, DURATION, FONT, NARASI_SRC, OUTRO, pop, SCENE_IDS, SceneId, SCENES, TL } from "./timeline";

const W = SCENES.peringatan;

/** Seberapa "merah" suasana saat ini (0..1): naik di awal peringatan, turun di akhirnya. */
const useRedness = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [W.start - 6, W.start + 10, W.end - 10, W.end + 4], [0, 1, 1, 0], clamp);
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const red = useRedness();
  const blob = (x: number, y: number, s: number, ph: number, color: string) => ({
    position: "absolute" as const,
    left: x + Math.sin(frame / 40 + ph) * 60,
    top: y + Math.cos(frame / 50 + ph) * 60,
    width: s,
    height: s,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color}, transparent 68%)`,
  });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(10,26,107,0.08) 3px, transparent 3px)",
          backgroundSize: "54px 54px",
          backgroundPosition: `0 ${-frame * 0.4}px`,
        }}
      />
      <div style={blob(-300, 150, 900, 0, `${C.cyan}30`)} />
      <div style={blob(500, 1000, 1000, 2, `${C.brandNavy}18`)} />
      {/* lapisan merah khusus scene peringatan */}
      <AbsoluteFill
        style={{
          opacity: red,
          background: `linear-gradient(180deg, ${C.redSoft} 0%, #F9D3D0 100%)`,
        }}
      >
        <AbsoluteFill
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, ${C.red}10 0 30px, transparent 30px 60px)`,
          }}
        />
        <AbsoluteFill style={{ boxShadow: `inset 0 0 ${160 + 60 * Math.sin(frame / 6)}px ${C.red}55` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Caption karaoke: kata menyala saat diucapkan. */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const red = useRedness();
  const line = TL.find((l) => frame >= l.start && frame < l.end);
  if (!line) return null;
  const per = (line.speakEnd - line.start) / line.words.length;
  const p = pop(frame, fps, line.start, { damping: 16, stiffness: 160 });
  const out = interpolate(frame, [line.end - 5, line.end], [1, 0], clamp);
  const warn = red > 0.5;
  let em = false;
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1540,
        display: "flex",
        justifyContent: "center",
        opacity: p * out,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <div
        style={{
          background: warn ? C.redDark : C.navy,
          borderRadius: 34,
          padding: "26px 40px",
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.28,
          textAlign: "center",
          boxShadow: `0 18px 40px ${C.shadow}`,
        }}
      >
        {line.words.map((w, i) => {
          const stars = (w.match(/\*/g) || []).length;
          const opens = /^[“"]?\*/.test(w);
          if (opens) em = true;
          const isEm = em;
          if (stars === 2 || (stars === 1 && !opens)) em = false;
          const clean = w.replace(/\*/g, "");
          const t = line.start + i * per;
          const lit = interpolate(frame, [t - 2, t + 3], [0, 1], clamp);
          const color = isEm ? (warn ? "#FFD0CC" : C.cyanBright) : "#FFFFFF";
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 15,
                color,
                opacity: 0.38 + 0.62 * lit,
                transform: `translateY(${(1 - lit) * 6}px)`,
              }}
            >
              {clean}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const red = useRedness();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, background: "rgba(10,26,107,0.1)" }}>
      <div
        style={{
          height: "100%",
          width: `${(frame / DURATION) * 100}%`,
          background: red > 0.5 ? C.red : `linear-gradient(90deg, ${C.brandNavy}, ${C.cyan})`,
        }}
      />
    </div>
  );
};

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  hook: SceneHook,
  piutang: ScenePiutang,
  dua: SceneDua,
  uang: SceneUang,
  penjualan: ScenePenjualan,
  lainnya: SceneLainnya,
  barang: SceneBarang,
  uangmuka: SceneUangMuka,
  jaminan: SceneJaminan,
  dimuka: SceneDiMuka,
  peringatan: ScenePeringatan,
  neraca: SceneNeraca,
  cta: SceneCta,
};

/** Fade masuk/keluar tiap scene. */
const Scene: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const dur = SCENES[id].end - SCENES[id].start;
  return (
    <Sequence from={SCENES[id].start} durationInFrames={dur} layout="none">
      <SceneFade dur={dur}>{children}</SceneFade>
    </Sequence>
  );
};

const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = Math.min(interpolate(frame, [0, 8], [0, 1], clamp), interpolate(frame, [dur - 8, dur], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** 1080×1920 video vertikal untuk Instagram Reels, YouTube Shorts, dan TikTok. */
export const HartaLupaDihitung: React.FC<ShareProps> = ({ withCover }) => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Background />
    {SCENE_IDS.map((id) => {
      const Comp = SCENE_COMPONENTS[id];
      return (
        <Scene key={id} id={id}>
          <Comp />
        </Scene>
      );
    })}
    <Captions />
    <ProgressBar />
    <Sequence from={OUTRO.start} durationInFrames={OUTRO.end - OUTRO.start} layout="none">
      <BrandOutro />
    </Sequence>
    {NARASI_SRC && <Audio src={staticFile(NARASI_SRC)} />}
    {/* versi share: frame 0 = cover (preview WhatsApp / galeri) */}
    <CoverFrame show={withCover}>
      <HartaLupaCoverInstagram />
    </CoverFrame>
  </AbsoluteFill>
);
