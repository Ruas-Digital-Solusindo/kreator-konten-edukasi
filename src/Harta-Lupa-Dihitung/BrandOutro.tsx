import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, FONT, LOGO_SRC, pop } from "./timeline";

const NAVY = C.brandNavy;
const CYAN = C.cyanBright;
const MID = "#0090D8";

const LOGO = 420;
const LOGO_TOP = 467;
const LOGO_CY = LOGO_TOP + LOGO / 2;

/** Kata yang muncul dari balik garis (mask reveal). */
const Reveal: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: 18, marginBottom: -18 }}>
    <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)` }}>{children}</span>
  </span>
);

const Particles: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {new Array(18).fill(0).map((_, i) => {
      const x = random(`x${i}`) * 1080;
      const startY = 1950 + random(`y${i}`) * 400;
      const speed = 3 + random(`s${i}`) * 4;
      const size = 8 + random(`r${i}`) * 18;
      const y = startY - frame * speed;
      const color = i % 3 === 0 ? NAVY : i % 3 === 1 ? CYAN : MID;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + Math.sin(frame / 15 + i) * 20,
            top: y,
            width: size,
            height: size,
            borderRadius: size,
            background: color,
            opacity: 0.18 + 0.2 * random(`o${i}`),
          }}
        />
      );
    })}
  </>
);

/** End card motion graphic: logo, "Ruas Accounting", tagline (latar putih, navy → cyan). */
export const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dua lapis wipe: lingkaran gradien navy→cyan, lalu putih di dalamnya.
  const wipeColor = interpolate(frame, [0, 14], [0, 135], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wipeWhite = interpolate(frame, [5, 20], [0, 135], { ...clamp, easing: Easing.out(Easing.cubic) });

  const logo = pop(frame, fps, 12, { damping: 11, stiffness: 140 });
  const ring1 = interpolate(frame, [22, 60], [0, 1], clamp);
  const ring2 = interpolate(frame, [32, 70], [0, 1], clamp);
  const shine = interpolate(frame, [34, 58], [-1, 1.4], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const float = Math.sin(frame / 18) * 8;

  const ruas = pop(frame, fps, 24, { damping: 16 });
  const acc = pop(frame, fps, 31, { damping: 16 });
  const line = interpolate(frame, [36, 56], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag1 = pop(frame, fps, 44, { damping: 15 });
  const tag2 = pop(frame, fps, 52, { damping: 15 });
  const mark = interpolate(frame, [62, 80], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const ring = (p: number) => (
    <div
      style={{
        position: "absolute",
        left: 540 - LOGO / 2,
        top: LOGO_CY - LOGO / 2,
        width: LOGO,
        height: LOGO,
        borderRadius: "50%",
        border: `6px solid ${CYAN}`,
        opacity: (1 - p) * 0.7 * (p > 0 ? 1 : 0),
        transform: `scale(${1 + p * 0.9})`,
      }}
    />
  );

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          clipPath: `circle(${wipeColor}% at 50% 36%)`,
          background: `linear-gradient(135deg, ${NAVY}, ${MID} 55%, ${CYAN})`,
        }}
      />
      <AbsoluteFill style={{ clipPath: `circle(${wipeWhite}% at 50% 36%)`, background: "#FFFFFF" }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 90% 30% at 50% 100%, ${CYAN}26, transparent 100%), radial-gradient(ellipse 90% 22% at 50% 0%, ${NAVY}0D, transparent 100%)`,
          }}
        />
        <Particles frame={frame} />

        {ring(ring1)}
        {ring(ring2)}

        {/* logo + kilau yang menyapu, dimask oleh bentuk logo */}
        <div
          style={{
            position: "absolute",
            left: 540 - LOGO / 2,
            top: LOGO_TOP,
            width: LOGO,
            height: LOGO,
            transform: `translateY(${float}px) scale(${logo}) rotate(${(1 - logo) * -25}deg)`,
          }}
        >
          <Img src={staticFile(LOGO_SRC)} style={{ width: LOGO, height: LOGO, display: "block" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `url(${staticFile(LOGO_SRC)})`,
              WebkitMaskSize: "100% 100%",
              maskImage: `url(${staticFile(LOGO_SRC)})`,
              maskSize: "100% 100%",
              background: `linear-gradient(115deg, transparent ${(shine * 100 - 15).toFixed(1)}%, rgba(255,255,255,0.75) ${(shine * 100).toFixed(1)}%, transparent ${(shine * 100 + 15).toFixed(1)}%)`,
            }}
          />
        </div>

        {/* nama brand */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1010,
            textAlign: "center",
            fontSize: 118,
            fontWeight: 900,
            letterSpacing: -1,
            lineHeight: 1.1,
            color: NAVY,
            whiteSpace: "nowrap",
          }}
        >
          <Reveal p={ruas}>Ruas</Reveal>{" "}
          <Reveal p={acc}>
            <span
              style={{
                background: `linear-gradient(90deg, ${MID}, ${NAVY})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Accounting
            </span>
          </Reveal>
        </div>

        <div
          style={{
            position: "absolute",
            left: 340,
            right: 340,
            top: 1175,
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${CYAN}, ${NAVY})`,
            transform: `scaleX(${line})`,
          }}
        />

        {/* tagline */}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1222,
            textAlign: "center",
            fontSize: 54,
            fontWeight: 700,
            color: "#3A4566",
            lineHeight: 1.3,
          }}
        >
          <div style={{ opacity: tag1, transform: `translateY(${(1 - tag1) * 40}px)` }}>Software akuntansi</div>
          <div style={{ opacity: tag2, transform: `translateY(${(1 - tag2) * 40}px)` }}>
            untuk{" "}
            <b style={{ position: "relative", color: MID, display: "inline-block" }}>
              <span
                style={{
                  position: "absolute",
                  left: -6,
                  right: -6,
                  bottom: 4,
                  height: 18,
                  borderRadius: 9,
                  background: `${CYAN}55`,
                  transformOrigin: "left",
                  transform: `scaleX(${mark})`,
                }}
              />
              <span style={{ position: "relative" }}>non akuntan</span>
            </b>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
