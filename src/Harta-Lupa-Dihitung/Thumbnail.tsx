import React from "react";
import { AbsoluteFill } from "remotion";
import { Bill } from "./components";
import { C, FONT } from "./timeline";

// Judul thumbnail dari catatan: "HARTA YANG LUPA DIHITUNG"

export const Bg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg}, ${C.bg2})` }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(10,26,107,0.08) 3px, transparent 3px)", backgroundSize: "54px 54px" }} />
    <div style={{ position: "absolute", left: "5%", top: "40%", width: "90%", height: "60%", background: `radial-gradient(circle, ${C.cyan}40, transparent 65%)` }} />
  </AbsoluteFill>
);

export const GradText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: `linear-gradient(90deg, ${C.brandNavy}, ${C.mid} 55%, ${C.cyan})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

/** Nota dengan status LUNAS kosong. */
export const Nota: React.FC<{ s: number }> = ({ s }) => (
  <div
    style={{
      width: 620 * s,
      background: "#fff",
      border: `${6 * s}px solid ${C.navy}`,
      borderRadius: 30 * s,
      padding: `${28 * s}px ${36 * s}px`,
      boxShadow: `0 ${24 * s}px ${50 * s}px ${C.shadow}`,
      transform: "rotate(-4deg)",
      color: C.navy,
    }}
  >
    <div style={{ fontSize: 56 * s, fontWeight: 900, letterSpacing: 4 * s }}>NOTA</div>
    <div style={{ fontSize: 36 * s, fontWeight: 700, color: C.ink, borderBottom: `${3 * s}px dashed ${C.line}`, padding: `${8 * s}px 0` }}>
      20 krat · Rp 8.400.000
    </div>
    <div style={{ display: "flex", gap: 18 * s, marginTop: 20 * s }}>
      <div style={{ flex: 1, textAlign: "center", borderRadius: 18 * s, background: `linear-gradient(135deg, ${C.mid}, ${C.cyan})`, color: "#fff", border: `${5 * s}px solid ${C.navy}`, padding: `${10 * s}px 0`, fontSize: 32 * s, fontWeight: 900 }}>
        DIKIRIM ✔
      </div>
      <div style={{ flex: 1, textAlign: "center", borderRadius: 18 * s, border: `${5 * s}px dashed ${C.navy}`, padding: `${10 * s}px 0`, fontSize: 32 * s, fontWeight: 900 }}>
        LUNAS ?
      </div>
    </div>
  </div>
);

export const HartaLupaThumbVertical: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Bg />
    <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", fontWeight: 900, lineHeight: 1.0, color: C.navy }}>
      <div style={{ fontSize: 210, letterSpacing: 4 }}>
        <GradText>HARTA</GradText>
      </div>
      <div style={{ fontSize: 110, margin: "20px 0" }}>YANG LUPA</div>
      <div style={{ fontSize: 150 }}>
        <span style={{ display: "inline-block", background: C.navy, color: "#fff", padding: "6px 34px", borderRadius: 26, transform: "rotate(-2deg)" }}>DIHITUNG</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 150, top: 960 }}>
      <Nota s={1.2} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 870, transform: "rotate(-14deg)" }}>
      <Bill w={240} />
    </div>
    <div style={{ position: "absolute", left: 780, top: 1400, transform: "rotate(12deg)" }}>
      <Bill w={210} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: `linear-gradient(90deg, ${C.brandNavy}, ${C.mid})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 62, fontWeight: 900, lineHeight: 1.15, padding: "0 50px" }}>
      <div>
        Bisa puluhan juta,
        <br />
        <span style={{ color: C.cyanBright }}>ada di tangan orang lain</span>
      </div>
    </div>
  </AbsoluteFill>
);

export const HartaLupaThumbLandscape: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Bg />
    <div style={{ position: "absolute", left: 60, top: 70, fontWeight: 900, lineHeight: 1.0, color: C.navy }}>
      <div style={{ fontSize: 150, letterSpacing: 3 }}>
        <GradText>HARTA</GradText>
      </div>
      <div style={{ fontSize: 84, margin: "14px 0" }}>YANG LUPA</div>
      <div style={{ fontSize: 104 }}>
        <span style={{ display: "inline-block", background: C.navy, color: "#fff", padding: "4px 26px", borderRadius: 20, transform: "rotate(-2deg)" }}>DIHITUNG</span>
      </div>
      <div style={{ fontSize: 40, marginTop: 40, color: C.ink }}>
        Bisa puluhan juta, <span style={{ color: C.mid }}>di tangan orang lain</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 760, top: 200 }}>
      <Nota s={0.74} />
    </div>
    <div style={{ position: "absolute", left: 1000, top: 90, transform: "rotate(14deg)" }}>
      <Bill w={180} />
    </div>
  </AbsoluteFill>
);
