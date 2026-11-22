import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, pop } from "./timeline";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

/** Muncul di `delay` (pegas), opsional hilang di `out`. Posisi absolut lewat `style`. */
export const In: React.FC<{
  delay: number;
  out?: number;
  from?: "up" | "down" | "left" | "right" | "scale";
  dist?: number;
  damping?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay, out, from = "up", dist = 60, damping = 13, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay, { damping });
  const o = out === undefined ? 1 : interpolate(frame, [out, out + 8], [1, 0], clamp);
  if (frame < delay || o <= 0) return null;
  const d = (1 - p) * dist;
  const t =
    from === "up"
      ? `translateY(${d}px)`
      : from === "down"
        ? `translateY(${-d}px)`
        : from === "left"
          ? `translateX(${-d}px)`
          : from === "right"
            ? `translateX(${d}px)`
            : `scale(${0.3 + 0.7 * p})`;
  return (
    <div style={{ position: "absolute", opacity: Math.min(1, p * 1.4) * o, transform: t, ...style }}>{children}</div>
  );
};

/** Cross-fade + sedikit zoom di batas beat. */
export const SceneWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 10], [0, 1], clamp);
  const outP = interpolate(frame, [dur - 8, dur], [1, 0], clamp);
  const scale = interpolate(frame, [0, 10], [1.04, 1], clamp) * interpolate(frame, [dur - 8, dur], [1, 0.96], clamp);
  return <AbsoluteFill style={{ opacity: Math.min(inP, outP), transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};

export const Beat: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <SceneWrap dur={to - from}>{children}</SceneWrap>
  </Sequence>
);

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

export const Panel: React.FC<{
  style?: React.CSSProperties;
  border?: string;
  bg?: string;
  children: React.ReactNode;
}> = ({ style, border = C.navy, bg = C.paper, children }) => (
  <div
    style={{
      background: bg,
      border: `5px solid ${border}`,
      borderRadius: 34,
      boxShadow: `0 22px 44px ${C.shadow}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Label kategori di bagian atas scene. */
export const TopChip: React.FC<{ delay?: number; color?: string; children: React.ReactNode }> = ({
  delay = 0,
  color,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay, { damping: 12 });
  if (frame < delay) return null;
  return (
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: color ?? `linear-gradient(90deg, ${C.brandNavy}, ${C.mid})`,
          color: "#fff",
          borderRadius: 999,
          padding: "18px 44px",
          fontSize: 50,
          fontWeight: 900,
          letterSpacing: 2,
          boxShadow: `0 14px 30px ${C.shadow}`,
          opacity: Math.min(1, p * 1.4),
          transform: `scale(${0.6 + 0.4 * p})`,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Judul besar yang muncul dengan pegas. */
export const Head: React.FC<{
  top: number;
  delay?: number;
  size?: number;
  color?: string;
  children: React.ReactNode;
}> = ({ top, delay = 0, size = 72, color = C.navy, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay, { damping: 13 });
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top,
        textAlign: "center",
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1.08,
        color,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 50}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Teks bergradasi navy → cyan. */
export const Grad: React.FC<{ children: React.ReactNode; from?: string; to?: string }> = ({
  children,
  from = C.brandNavy,
  to = C.cyan,
}) => (
  <span
    style={{
      background: `linear-gradient(90deg, ${from}, ${to})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

/** Cap karet yang dihentakkan di `delay`. */
export const Stamp: React.FC<{
  text: string;
  delay: number;
  color?: string;
  rot?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ text, delay, color = C.red, rot = -12, fontSize = 84, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay, { damping: 11, stiffness: 220 });
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        border: `9px solid ${color}`,
        color,
        borderRadius: 18,
        padding: "8px 30px",
        fontSize,
        fontWeight: 900,
        letterSpacing: 4,
        background: "rgba(255,255,255,0.85)",
        transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [2.6, 1])})`,
        opacity: Math.min(1, p * 1.6),
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Garis coret yang tergambar dari kiri ke kanan. */
export const Strike: React.FC<{ delay: number; color?: string; width?: number; rot?: number }> = ({
  delay,
  color = C.navy,
  width = 14,
  rot = -8,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 8], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: "-6%",
        right: "-6%",
        top: "50%",
        height: width,
        marginTop: -width / 2,
        borderRadius: width,
        background: color,
        transformOrigin: "left center",
        transform: `rotate(${rot}deg) scaleX(${p})`,
      }}
    />
  );
};

/** Lingkaran ikon + label (orang / tempat). */
export const Badge: React.FC<{
  emoji: string;
  label: string;
  size?: number;
  bg?: string;
  border?: string;
  labelColor?: string;
}> = ({ emoji, label, size = 230, bg = C.soft, border = C.navy, labelColor = C.navy }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: size + 80 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        border: `6px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        boxShadow: `0 16px 34px ${C.shadow}`,
      }}
    >
      {emoji}
    </div>
    <div style={{ fontSize: 44, fontWeight: 900, color: labelColor, textAlign: "center", whiteSpace: "nowrap" }}>
      {label}
    </div>
  </div>
);

/** Lembar uang kertas sederhana. */
export const Bill: React.FC<{ w?: number; label?: string }> = ({ w = 170, label = "Rp" }) => (
  <div
    style={{
      width: w,
      height: w * 0.5,
      borderRadius: w * 0.07,
      background: `linear-gradient(135deg, ${C.cyan}, ${C.mid})`,
      border: `4px solid ${C.navy}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 900,
      fontSize: w * 0.2,
      boxShadow: `0 10px 20px ${C.shadow}`,
    }}
  >
    <div
      style={{
        border: "3px solid rgba(255,255,255,0.7)",
        borderRadius: 999,
        padding: `0 ${w * 0.08}px`,
      }}
    >
      {label}
    </div>
  </div>
);

/** Truk sederhana menghadap kanan. */
export const Truck: React.FC<{ w?: number; color?: string; cargo?: boolean; wheelTurn?: number }> = ({
  w = 340,
  color = C.blue,
  cargo = true,
  wheelTurn = 0,
}) => {
  const s = w / 340;
  return (
    <svg width={w} height={200 * s} viewBox="0 0 340 200">
      <rect x={10} y={40} width={210} height={120} rx={14} fill={cargo ? "#fff" : "#fff"} stroke={C.navy} strokeWidth={7} />
      {cargo && (
        <>
          <rect x={40} y={70} width={60} height={60} rx={6} fill="#F2C47A" stroke={C.navy} strokeWidth={5} />
          <rect x={115} y={70} width={60} height={60} rx={6} fill="#F2C47A" stroke={C.navy} strokeWidth={5} />
          <line x1={70} y1={70} x2={70} y2={95} stroke={C.navy} strokeWidth={4} />
          <line x1={145} y1={70} x2={145} y2={95} stroke={C.navy} strokeWidth={4} />
        </>
      )}
      <path d="M220 80 H285 L325 120 V160 H220 Z" fill={color} stroke={C.navy} strokeWidth={7} strokeLinejoin="round" />
      <path d="M240 95 H280 L305 120 H240 Z" fill={C.soft} stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
      {[70, 270].map((cx) => (
        <g key={cx} transform={`rotate(${wheelTurn} ${cx} 165)`}>
          <circle cx={cx} cy={165} r={28} fill={C.navy} />
          <circle cx={cx} cy={165} r={11} fill="#fff" />
          <rect x={cx - 3} y={140} width={6} height={14} fill="#fff" />
        </g>
      ))}
    </svg>
  );
};

/** Krat minuman berisi botol. */
export const Crate: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 300 240">
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={38 + i * 60} y={20} width={44} height={120} rx={14} fill="#7FD6E6" stroke={C.navy} strokeWidth={5} />
        <rect x={50 + i * 60} y={0} width={20} height={30} rx={4} fill={C.mid} stroke={C.navy} strokeWidth={5} />
      </g>
    ))}
    <rect x={14} y={100} width={272} height={130} rx={16} fill={C.blue} stroke={C.navy} strokeWidth={7} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={50 + i * 75} y={130} width={50} height={26} rx={8} fill={C.navy} opacity={0.55} />
    ))}
    <line x1={14} y1={185} x2={286} y2={185} stroke={C.navy} strokeWidth={5} />
  </svg>
);

/** Tabung gas. */
export const GasTank: React.FC<{ w?: number }> = ({ w = 170 }) => (
  <svg width={w} height={w * 1.6} viewBox="0 0 170 272">
    <rect x={55} y={6} width={60} height={34} rx={8} fill={C.line} stroke={C.navy} strokeWidth={6} />
    <rect x={18} y={36} width={134} height={226} rx={56} fill={C.cyan} stroke={C.navy} strokeWidth={7} />
    <rect x={18} y={120} width={134} height={50} fill={C.brandNavy} opacity={0.85} />
    <rect x={18} y={36} width={134} height={226} rx={56} fill="none" stroke={C.navy} strokeWidth={7} />
    <text x={85} y={155} textAnchor="middle" fontSize={30} fontWeight={900} fill="#fff">
      GAS
    </text>
  </svg>
);

/** Label gantung berayun. */
export const HangTag: React.FC<{ text: string; delay: number; color?: string }> = ({ text, delay, color = C.cyan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay, { damping: 6, stiffness: 90 });
  if (frame < delay) return null;
  const swing = (1 - p) * 40 + Math.sin((frame - delay) / 9) * 3;
  return (
    <div style={{ transformOrigin: "50% 0%", transform: `rotate(${swing}deg)`, opacity: Math.min(1, p * 2) }}>
      <div style={{ width: 4, height: 40, margin: "0 auto", background: C.navy }} />
      <div
        style={{
          background: color,
          color: "#fff",
          fontWeight: 900,
          fontSize: 38,
          letterSpacing: 2,
          padding: "10px 24px",
          borderRadius: 14,
          border: `4px solid ${C.navy}`,
          whiteSpace: "nowrap",
          boxShadow: `0 10px 20px ${C.shadow}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Papan dua bagian: atas = hak menerima uang, bawah = hak menerima barang/jasa. */
export const SplitBoard: React.FC<{
  focus: "none" | "top" | "bottom";
  focusAt?: number;
  divideAt?: number;
  topExtra?: React.ReactNode;
  bottomExtra?: React.ReactNode;
}> = ({ focus, focusAt = 0, divideAt = 0, topExtra, bottomExtra }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = pop(frame, fps, focusAt, { damping: 16 });
  const topOn = focus === "none" ? 1 : focus === "top" ? 1 : 1 - 0.6 * f;
  const botOn = focus === "none" ? 1 : focus === "bottom" ? 1 : 1 - 0.6 * f;
  const topScale = focus === "top" ? 1 + 0.04 * f : focus === "bottom" ? 1 - 0.05 * f : 1;
  const botScale = focus === "bottom" ? 1 + 0.04 * f : focus === "top" ? 1 - 0.05 * f : 1;
  const divide = interpolate(frame, [divideAt, divideAt + 14], [0, 1], clamp);
  const pTop = pop(frame, fps, 4, { damping: 14 });
  const pBot = pop(frame, fps, 12, { damping: 14 });

  const half = (
    which: "top" | "bottom",
    on: number,
    scale: number,
    p: number,
    content: React.ReactNode,
    extra: React.ReactNode,
  ) => {
    const isTop = which === "top";
    const glow = (focus === which ? f : 0) * 1;
    return (
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: isTop ? 290 : 870,
          height: 520,
          borderRadius: 40,
          background: isTop
            ? `linear-gradient(135deg, ${C.brandNavy}, ${C.mid})`
            : `linear-gradient(135deg, ${C.mid}, ${C.cyan})`,
          border: `6px solid ${C.navy}`,
          boxShadow: `0 24px 50px ${C.shadow}, 0 0 ${80 * glow}px ${C.cyanBright}`,
          opacity: on * Math.min(1, p * 1.4),
          transform: `translateX(${(1 - p) * (isTop ? -200 : 200)}px) scale(${scale})`,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {content}
        {extra}
      </div>
    );
  };

  return (
    <>
      {half(
        "top",
        topOn,
        topScale,
        pTop,
        <div style={{ position: "absolute", left: 50, top: 50 }}>
          <div style={{ fontSize: 40, fontWeight: 800, opacity: 0.85, letterSpacing: 3 }}>BENTUK 1 · HAK MENERIMA</div>
          <div style={{ fontSize: 130, fontWeight: 900, lineHeight: 1.05 }}>UANG</div>
          <div style={{ fontSize: 130, marginTop: 10 }}>💵</div>
        </div>,
        topExtra,
      )}
      {half(
        "bottom",
        botOn,
        botScale,
        pBot,
        <div style={{ position: "absolute", left: 50, top: 50 }}>
          <div style={{ fontSize: 40, fontWeight: 800, opacity: 0.9, letterSpacing: 3 }}>BENTUK 2 · HAK MENERIMA</div>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 1.05 }}>BARANG & JASA</div>
          <div style={{ fontSize: 130, marginTop: 10 }}>📦🔑</div>
        </div>,
        bottomExtra,
      )}
      {/* garis pemisah */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 838,
          height: 8,
          borderRadius: 4,
          background: `repeating-linear-gradient(90deg, ${C.navy} 0 30px, transparent 30px 48px)`,
          transformOrigin: "left",
          transform: `scaleX(${divide})`,
        }}
      />
    </>
  );
};
