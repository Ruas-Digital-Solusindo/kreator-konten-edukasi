import React from "react";
import { AbsoluteFill } from "remotion";
import { Bill } from "./components";
import { Bg, Nota } from "./Thumbnail";
import { C, FONT } from "./timeline";

/*
 * Cover 1080×1920 per platform. Judul ditaruh di zona aman masing-masing:
 *
 * Instagram Reels : grid profil memotong tengah 3:4 (y 240–1680), grid lama 1:1 (y 420–1500).
 *                   Judul + visual utama di dalam kotak 1:1 tengah.
 * TikTok          : grid profil memotong tengah 3:4 (y 240–1680). Saat diputar, ikon kanan
 *                   (x > 930, y 700–1500) dan caption bawah (y > 1480) menutupi layar.
 * YouTube Shorts  : judul video + nama kanal menutupi bawah (y > 1420), tombol kanan
 *                   (x > 920, y 880–1600). Shelf beranda menampilkan penuh 9:16.
 */

type Layout = {
  /** Area judul: kiri, kanan (padding), atas. */
  left: number;
  right: number;
  top: number;
  /** Ukuran huruf tiga baris judul. */
  sizes: [number, number, number];
  nota: { left: number; top: number; s: number };
  bills: { left: number; top: number; w: number; rot: number }[];
  sub?: { left: number; right: number; top: number; size: number };
  pill?: { top: number };
};

/** Gradasi gelap supaya tetap kontras saat thumbnail kecil. */
const DarkGrad: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: `linear-gradient(90deg, ${C.brandNavy}, ${C.blue})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

const Cover: React.FC<{ L: Layout }> = ({ L }) => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Bg />
    {L.pill && (
      <div style={{ position: "absolute", top: L.pill.top, left: L.left, right: L.right, textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            background: `linear-gradient(90deg, ${C.mid}, ${C.cyan})`,
            color: "#fff",
            fontSize: 50,
            fontWeight: 900,
            letterSpacing: 3,
            padding: "12px 38px",
            borderRadius: 999,
          }}
        >
          BELAJAR PIUTANG
        </span>
      </div>
    )}
    <div
      style={{
        position: "absolute",
        top: L.top,
        left: L.left,
        right: L.right,
        textAlign: "center",
        fontWeight: 900,
        lineHeight: 1.0,
        color: C.navy,
      }}
    >
      <div style={{ fontSize: L.sizes[0], letterSpacing: 2 }}>
        <DarkGrad>HARTA</DarkGrad>
      </div>
      <div style={{ fontSize: L.sizes[1], margin: `${L.sizes[1] * 0.12}px 0 ${L.sizes[1] * 0.2}px` }}>YANG LUPA</div>
      <div style={{ fontSize: L.sizes[2] }}>
        <span
          style={{
            display: "inline-block",
            background: C.navy,
            color: "#fff",
            padding: `${L.sizes[2] * 0.04}px ${L.sizes[2] * 0.2}px`,
            borderRadius: L.sizes[2] * 0.16,
            transform: "rotate(-2deg)",
            boxShadow: `0 ${L.sizes[2] * 0.08}px 0 ${C.cyan}`,
          }}
        >
          DIHITUNG
        </span>
      </div>
    </div>
    {L.bills.map((b, i) => (
      <div key={i} style={{ position: "absolute", left: b.left, top: b.top, transform: `rotate(${b.rot}deg)` }}>
        <Bill w={b.w} />
      </div>
    ))}
    <div style={{ position: "absolute", left: L.nota.left, top: L.nota.top }}>
      <Nota s={L.nota.s} />
    </div>
    {L.sub && (
      <div
        style={{
          position: "absolute",
          left: L.sub.left,
          right: L.sub.right,
          top: L.sub.top,
          textAlign: "center",
          fontSize: L.sub.size,
          fontWeight: 900,
          lineHeight: 1.2,
          color: C.navy,
        }}
      >
        Bisa puluhan juta,
        <br />
        <span style={{ color: C.blue }}>di tangan orang lain</span>
      </div>
    )}
  </AbsoluteFill>
);

/** Instagram Reels: semua penting di kotak 1:1 tengah (y 420–1500). */
export const HartaLupaCoverInstagram: React.FC = () => (
  <Cover
    L={{
      left: 40,
      right: 40,
      top: 450,
      sizes: [250, 122, 168],
      nota: { left: 245, top: 1095, s: 0.95 },
      bills: [
        { left: 120, top: 1080, w: 190, rot: -14 },
        { left: 790, top: 1300, w: 170, rot: 12 },
      ],
      pill: { top: 300 },
      sub: { left: 60, right: 60, top: 1515, size: 54 },
    }}
  />
);

/** TikTok: 3:4 tengah, judul tidak menyentuh kolom ikon kanan. */
export const HartaLupaCoverTiktok: React.FC = () => (
  <Cover
    L={{
      left: 40,
      right: 150,
      top: 300,
      sizes: [236, 116, 156],
      nota: { left: 110, top: 960, s: 0.95 },
      bills: [{ left: 50, top: 940, w: 180, rot: -14 }],
      sub: { left: 40, right: 150, top: 1320, size: 54 },
    }}
  />
);

/** YouTube Shorts: judul di atas, bawah dikosongkan untuk judul video dan nama kanal. */
export const HartaLupaCoverShorts: React.FC = () => (
  <Cover
    L={{
      left: 40,
      right: 40,
      top: 230,
      sizes: [270, 132, 178],
      nota: { left: 80, top: 950, s: 0.95 },
      bills: [{ left: 40, top: 930, w: 180, rot: -14 }],
      sub: { left: 40, right: 170, top: 1290, size: 54 },
    }}
  />
);
