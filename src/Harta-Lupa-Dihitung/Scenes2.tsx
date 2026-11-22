import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Beat, Bill, Crate, GasTank, Grad, Head, HangTag, In, Panel, SplitBoard, Stamp, Strike, TopChip, Truck } from "./components";
import { at, atEnd, C, clamp, pop, sceneLen } from "./timeline";

/* ------------------------------------------------------------------ */
/* 7. BENTUK 2: hak menerima barang atau jasa                           */
/* ------------------------------------------------------------------ */
const NotCash: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay, { damping: 12 });
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 600,
        top: 236,
        width: 280,
        padding: "16px 16px",
        borderRadius: 34,
        background: "#fff",
        border: `6px solid ${C.navy}`,
        color: C.navy,
        textAlign: "center",
        transform: `scale(${p}) rotate(${(1 - p) * 10}deg)`,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 800, color: C.muted }}>kembalinya</div>
      <div style={{ position: "relative", display: "inline-block", margin: "12px 0" }}>
        <Bill w={130} />
        <Strike delay={delay + 10} color={C.navy} width={12} rot={-20} />
      </div>
      <div style={{ fontSize: 40, fontWeight: 900 }}>bukan uang</div>
    </div>
  );
};

export const SceneBarang: React.FC = () => (
  <AbsoluteFill>
    <TopChip>YANG KEDUA</TopChip>
    <SplitBoard focus="bottom" focusAt={6} bottomExtra={<NotCash delay={at("b2") + 20} />} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 8. UANG MUKA PEMBELIAN                                               */
/* ------------------------------------------------------------------ */
export const SceneUangMuka: React.FC = () => {
  const frame = useCurrentFrame();
  const m2 = at("m2");
  const m3 = at("m3");
  const t = interpolate(frame, [m2 + 6, m2 + 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const dots = ".".repeat(1 + (Math.floor(frame / 8) % 3));
  return (
    <AbsoluteFill>
      <TopChip>UANG MUKA PEMBELIAN</TopChip>
      <In delay={6} from="left" style={{ left: 40, top: 320 }}>
        <Badge emoji="🙂" label="KAMU" size={200} />
      </In>
      <In delay={12} from="right" style={{ left: 740, top: 320 }}>
        <Badge emoji="🏭" label="PEMASOK" size={200} bg="#fff" />
      </In>
      {frame >= m2 && t < 1 && (
        <div style={{ position: "absolute", left: interpolate(t, [0, 1], [220, 760]), top: 360 - Math.sin(t * Math.PI) * 140 }}>
          <Bill w={170} label="DP" />
        </div>
      )}
      <In delay={m2 + 32} from="scale" style={{ left: 560, top: 630 }}>
        <div style={{ background: `linear-gradient(90deg, ${C.mid}, ${C.cyan})`, color: "#fff", fontSize: 42, fontWeight: 900, padding: "14px 30px", borderRadius: 999, border: `4px solid ${C.navy}`, whiteSpace: "nowrap" }}>
          ✔ SUDAH DIBAYAR
        </div>
      </In>
      {/* jalan kosong, truk belum datang */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 1150, height: 8, borderRadius: 4, background: `repeating-linear-gradient(90deg, ${C.navy}55 0 40px, transparent 40px 70px)` }} />
      <In delay={m3} from="right" style={{ left: 640, top: 950 }}>
        <div style={{ opacity: 0.35, filter: "grayscale(0.6)" }}>
          <Truck w={340} />
        </div>
      </In>
      <In delay={m3 + 4} from="up" style={{ left: 60, top: 820 }}>
        <Panel style={{ padding: "26px 36px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 90, transform: `rotate(${Math.sin(frame / 6) * 12}deg)` }}>⏳</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: C.navy, width: 400 }}>
            Barang belum datang{dots}
          </div>
        </Panel>
      </In>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9. UANG JAMINAN                                                      */
/* ------------------------------------------------------------------ */
export const SceneJaminan: React.FC = () => {
  const g2 = at("g2");
  const g3 = at("g3");
  const g4 = at("g4");
  const g5 = at("g5");
  return (
    <AbsoluteFill>
      <TopChip>UANG JAMINAN</TopChip>
      <In delay={g2} from="left" style={{ left: 70, top: 290 }}>
        <Panel style={{ width: 940, padding: "26px 40px", display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ fontSize: 120 }}>🏬</div>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.muted, letterSpacing: 2 }}>DEPOSIT SEWA KIOS</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: C.navy }}>Rp 10.000.000</div>
          </div>
        </Panel>
      </In>
      <div style={{ position: "absolute", left: 740, top: 470 }}>
        <HangTag text="DITITIPKAN" delay={g5} />
      </div>
      <In delay={g3 + 20} from="up" style={{ left: 80, top: 720 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Crate w={330} />
          <div style={{ fontSize: 40, fontWeight: 900, color: C.navy, marginTop: 6 }}>Jaminan krat</div>
        </div>
      </In>
      <div style={{ position: "absolute", left: 160, top: 1060 }}>
        <HangTag text="DITITIPKAN" delay={g5 + 8} />
      </div>
      <In delay={g3 + 34} from="up" style={{ left: 640, top: 640 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <GasTank w={190} />
          <div style={{ fontSize: 40, fontWeight: 900, color: C.navy, marginTop: 6 }}>Jaminan tabung</div>
        </div>
      </In>
      <div style={{ position: "absolute", left: 630, top: 1060 }}>
        <HangTag text="DITITIPKAN" delay={g5 + 16} />
      </div>
      <In delay={g4} from="scale" style={{ left: 0, right: 0, top: 1300 }}>
        <div style={{ textAlign: "center", fontSize: 66, fontWeight: 900, color: C.navy }}>
          tetap <Grad>MILIKMU</Grad>
        </div>
      </In>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 10. PEMBAYARAN DI MUKA: kalender 12 bulan menyala                    */
/* ------------------------------------------------------------------ */
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];

export const SceneDiMuka: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k2 = at("k2");
  const k3 = at("k3");
  const k4 = at("k4");
  const k5end = atEnd("k5");
  const step = (k5end - k4) / 12;
  return (
    <AbsoluteFill>
      <TopChip>PEMBAYARAN DI MUKA</TopChip>
      <In delay={k2} from="up" style={{ left: 70, top: 290 }}>
        <Panel style={{ width: 940, padding: "22px 40px", display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ fontSize: 96 }}>🏬</div>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.muted, letterSpacing: 2 }}>SEWA KIOS 1 TAHUN · SEKALIGUS</div>
            <div style={{ fontSize: 60, fontWeight: 900, color: C.navy }}>Rp 24.000.000</div>
          </div>
        </Panel>
      </In>
      {MONTHS.map((m, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const appear = pop(frame, fps, k2 + 10 + i * 2, { damping: 14 });
        const litAt = k4 + i * step;
        const lit = interpolate(frame, [litAt, litAt + 6], [0, 1], clamp);
        const bump = frame > litAt && frame < litAt + 10 ? 1 + 0.08 * Math.sin(((frame - litAt) / 10) * Math.PI) : 1;
        if (frame < k2 + 10 + i * 2) return null;
        return (
          <div
            key={m}
            style={{
              position: "absolute",
              left: 85 + col * 230,
              top: 520 + row * 170,
              width: 210,
              height: 150,
              borderRadius: 26,
              border: `5px solid ${C.navy}`,
              background: lit > 0 ? `linear-gradient(135deg, rgba(0,144,216,${lit}), rgba(0,229,255,${lit}))` : "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: lit > 0.5 ? "#fff" : C.navy,
              transform: `scale(${appear * bump})`,
              boxShadow: `0 12px 26px ${C.shadow}, 0 0 ${40 * lit}px ${C.cyanBright}88`,
            }}
          >
            <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: 2 }}>{m}</div>
            <div style={{ fontSize: 40, fontWeight: 900, opacity: lit }}>✔</div>
          </div>
        );
      })}
      <In delay={k3} out={k4 - 4} from="scale" style={{ left: 0, right: 0, top: 1060 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative" }}>
            <Bill w={150} />
            <Strike delay={k3 + 10} width={12} rot={-20} />
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, color: C.navy }}>tidak kembali jadi uang</div>
        </div>
      </In>
      <In delay={k4} from="scale" style={{ left: 0, right: 0, top: 1060 }}>
        <div style={{ textAlign: "center", fontSize: 60, fontWeight: 900, color: C.navy }}>
          tapi <Grad>TETAP HARTA</Grad>
        </div>
        <div style={{ textAlign: "center", fontSize: 44, fontWeight: 700, color: C.ink, marginTop: 10, opacity: frame > at("k5") ? 1 : 0 }}>
          tak perlu bayar sewa sampai tahun depan
        </div>
      </In>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 11. PERINGATAN: piutang macet (nuansa merah)                         */
/* ------------------------------------------------------------------ */
const Dust: React.FC = () => (
  <>
    {new Array(40).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${random(`dx${i}`) * 100}%`,
          top: `${random(`dy${i}`) * 100}%`,
          width: 4 + random(`ds${i}`) * 10,
          height: 4 + random(`ds${i}`) * 10,
          borderRadius: "50%",
          background: "rgba(110,90,60,0.35)",
        }}
      />
    ))}
  </>
);

export const ScenePeringatan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w2 = at("w2");
  const w3 = at("w3");
  const w4 = at("w4");
  const w5 = at("w5");
  const w6 = at("w6");
  const alarm = 0.5 + 0.5 * Math.sin(frame / 5);
  const grow = pop(frame - (w6 - w5), fps, 0, { damping: 15 });
  return (
    <AbsoluteFill>
      <TopChip color={`linear-gradient(90deg, ${C.redDark}, ${C.red})`}>
        <span style={{ display: "inline-block", transform: `scale(${1 + 0.08 * alarm})` }}>⚠</span> SATU HAL PENTING
      </TopChip>
      <Beat from={0} to={w5}>
        <In delay={w2} from="up" style={{ left: 120, top: 330 }}>
          <div
            style={{
              position: "relative",
              width: 840,
              padding: "36px 46px",
              borderRadius: 18,
              background: `linear-gradient(160deg, ${C.sepia}, #D9C9A3)`,
              border: "5px solid #8C7A55",
              transform: "rotate(-3deg)",
              boxShadow: "0 24px 50px rgba(80,40,20,0.25)",
              overflow: "hidden",
              filter: "saturate(0.8)",
            }}
          >
            <Dust />
            <div style={{ position: "relative", fontSize: 58, fontWeight: 900, color: "#5C4A2A", letterSpacing: 4 }}>NOTA · No. 0042</div>
            <div style={{ position: "relative", fontSize: 40, fontWeight: 700, color: "#5C4A2A", marginTop: 10 }}>Tanggal: 12 Maret 2023</div>
            <div style={{ position: "relative", fontSize: 40, fontWeight: 700, color: "#5C4A2A" }}>Toko Maju Terus · Rp 6.500.000</div>
            <div style={{ position: "relative", marginTop: 18, display: "inline-block", fontSize: 38, fontWeight: 900, color: "#fff", background: "#8C7A55", padding: "6px 24px", borderRadius: 999 }}>
              ⏳ 3 TAHUN BELUM TERTAGIH
            </div>
            {/* sarang laba-laba di sudut */}
            <svg width={170} height={170} viewBox="0 0 170 170" style={{ position: "absolute", right: 0, top: 0, opacity: 0.55 }}>
              {[40, 80, 120, 160].map((r) => (
                <path key={r} d={`M170 ${r} Q${170 - r * 0.55} ${r * 0.55} ${170 - r} 0`} fill="none" stroke="#5C4A2A" strokeWidth={2} />
              ))}
              {[0, 30, 60, 90].map((a) => (
                <line key={a} x1={170} y1={0} x2={170 - 170 * Math.cos((a * Math.PI) / 180)} y2={170 * Math.sin((a * Math.PI) / 180)} stroke="#5C4A2A" strokeWidth={2} />
              ))}
            </svg>
          </div>
        </In>
        <Stamp text="BUKAN HARTA" delay={w3 + 4} rot={-10} fontSize={96} style={{ left: 190, top: 520 }} />
        <In delay={w4} from="up" style={{ left: 0, right: 0, top: 900 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 120, fontWeight: 900, color: C.red, letterSpacing: 4, textShadow: `0 0 ${30 * alarm}px ${C.red}66` }}>KERUGIAN</div>
            <div style={{ fontSize: 50, fontWeight: 800, color: C.redDark }}>yang belum kamu akui</div>
          </div>
        </In>
      </Beat>
      <Beat from={w5} to={sceneLen("peringatan")}>
        <Head top={300} size={60} color={C.redDark}>
          usahamu terlihat <span style={{ color: C.red }}>lebih kaya</span>
        </Head>
        {/* dua batang: di laporan vs kenyataan */}
        {[
          { x: 170, label: "DI LAPORAN", h: 700, bg: `linear-gradient(180deg, ${C.mid}, ${C.brandNavy})`, d: 6 },
          { x: 590, label: "KENYATAAN", h: 480, bg: `linear-gradient(180deg, ${C.cyan}, ${C.mid})`, d: 14 },
        ].map((b) => {
          const p = pop(frame, fps, b.d, { damping: 16 });
          return (
            <div key={b.label} style={{ position: "absolute", left: b.x, top: 470, width: 320, height: 800 }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: b.h * p, borderRadius: "24px 24px 0 0", background: b.bg, border: `5px solid ${C.navy}` }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: -70, textAlign: "center", fontSize: 42, fontWeight: 900, color: C.navy }}>{b.label}</div>
            </div>
          );
        })}
        {/* selisih = piutang macet */}
        <div
          style={{
            position: "absolute",
            left: 590,
            top: 470 + 800 - 700,
            width: 320,
            height: 220 * grow,
            borderRadius: "24px 24px 0 0",
            border: `5px dashed ${C.red}`,
            background: `repeating-linear-gradient(45deg, ${C.red}33 0 14px, transparent 14px 28px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.red,
            fontWeight: 900,
            fontSize: 38,
            textAlign: "center",
            opacity: grow,
          }}
        >
          piutang
          <br />
          macet
        </div>
      </Beat>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 12. NERACA BERTUMPUK: sorot baris piutang di bagian harta            */
/* ------------------------------------------------------------------ */
type Row = { k: string; v: number; hlAt?: number };

export const SceneNeraca: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n1 = at("n1");
  const n2 = at("n2");
  const n3 = at("n3");
  const n4 = at("n4");
  const ROWS: Row[] = [
    { k: "Kas & bank", v: 12_000_000 },
    { k: "Piutang penjualan", v: 8_400_000, hlAt: n1 + 14 },
    { k: "Piutang lainnya", v: 1_700_000, hlAt: n3 },
    { k: "Uang muka pembelian", v: 5_000_000, hlAt: n2 },
    { k: "Uang jaminan", v: 10_000_000, hlAt: n2 + 32 },
    { k: "Sewa dibayar di muka", v: 24_000_000, hlAt: n3 + 10 },
    { k: "Persediaan", v: 30_000_000 },
    { k: "Peralatan", v: 15_000_000 },
  ];
  const sumHl = ROWS.filter((r) => r.hlAt !== undefined).reduce((a, r) => a + r.v, 0);
  const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const anyHl = frame > n1 + 14;
  const hartaHead = interpolate(frame, [n2, n2 + 10], [0, 1], clamp);
  const sumP = pop(frame, fps, n4, { damping: 12 });
  const counted = interpolate(frame, [n4, n4 + 30], [0, sumHl], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sheetIn = pop(frame, fps, 0, { damping: 16 });
  const ROW_H = 66;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 150,
          width: 940,
          borderRadius: 34,
          background: "#fff",
          border: `5px solid ${C.navy}`,
          boxShadow: `0 26px 54px ${C.shadow}`,
          overflow: "hidden",
          opacity: sheetIn,
          transform: `translateY(${(1 - sheetIn) * 80}px)`,
        }}
      >
        <div style={{ background: `linear-gradient(90deg, ${C.brandNavy}, ${C.mid})`, color: "#fff", padding: "20px 36px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: 6 }}>NERACA</div>
          <div style={{ fontSize: 32, fontWeight: 700, opacity: 0.85 }}>per hari ini</div>
        </div>
        <div
          style={{
            padding: "12px 36px",
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: 3,
            color: C.navy,
            background: `rgba(0,229,255,${0.12 + 0.25 * hartaHead})`,
            borderBottom: `3px solid ${C.line}`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>HARTA</span>
          <span style={{ fontSize: 28, opacity: hartaHead, color: C.mid }}>◀ sisi kiri</span>
        </div>
        {ROWS.map((r) => {
          const h = r.hlAt === undefined ? 0 : interpolate(frame, [r.hlAt, r.hlAt + 8], [0, 1], clamp);
          const flash = r.hlAt !== undefined && frame > r.hlAt && frame < r.hlAt + 14 ? Math.sin(((frame - r.hlAt) / 14) * Math.PI) : 0;
          const dim = anyHl && r.hlAt === undefined ? 0.45 : 1;
          return (
            <div
              key={r.k}
              style={{
                position: "relative",
                height: ROW_H,
                padding: "0 36px 0 50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 36,
                fontWeight: h > 0.5 ? 900 : 600,
                color: C.ink,
                opacity: dim,
                background: `rgba(0,184,217,${0.2 * h + 0.2 * flash})`,
                borderBottom: `2px solid ${C.line}`,
                transform: `scale(${1 + 0.03 * flash})`,
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14 * h, background: C.cyan }} />
              <span>{r.k}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(r.v)}</span>
            </div>
          );
        })}
        <div style={{ padding: "16px 36px", display: "flex", justifyContent: "space-between", fontSize: 38, fontWeight: 900, color: C.navy, borderBottom: `3px solid ${C.navy}` }}>
          <span>TOTAL HARTA</span>
          <span>106.100.000</span>
        </div>
        {[
          ["KEWAJIBAN", "Utang dagang", "20.000.000"],
          ["EKUITAS", "Modal pemilik", "86.100.000"],
        ].map(([head, k, v]) => (
          <div key={head} style={{ opacity: anyHl ? 0.35 : 0.7 }}>
            <div style={{ padding: "10px 36px", fontSize: 32, fontWeight: 900, letterSpacing: 3, color: C.muted, background: "#F4F7FB" }}>{head}</div>
            <div style={{ padding: "10px 36px 10px 50px", display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 600, color: C.ink }}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          </div>
        ))}
      </div>
      {frame >= n4 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1300,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${sumP})`,
          }}
        >
          <div style={{ background: `linear-gradient(135deg, ${C.brandNavy}, ${C.mid} 60%, ${C.cyan})`, color: "#fff", borderRadius: 30, padding: "16px 40px", fontSize: 50, fontWeight: 900, border: `5px solid ${C.navy}`, boxShadow: `0 20px 40px ${C.shadow}` }}>
            Σ di tangan orang lain: Rp {fmt(counted)}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 13. CTA                                                              */
/* ------------------------------------------------------------------ */
export const SceneCta: React.FC = () => {
  const frame = useCurrentFrame();
  const q = 1 + 0.08 * Math.sin(frame / 6);
  return (
    <AbsoluteFill>
      <Head top={240} size={92} delay={4}>
        BERAPA
      </Head>
      <Head top={350} size={150} delay={14}>
        <Grad>HARTAMU</Grad>
      </Head>
      <Head top={520} size={92} delay={30}>
        DI TANGAN
      </Head>
      <Head top={630} size={110} delay={44}>
        <Grad from={C.mid} to={C.cyan}>ORANG LAIN</Grad>
        <span style={{ display: "inline-block", color: C.navy, transform: `scale(${q})` }}>?</span>
      </Head>
      <In delay={56} from="scale" style={{ left: 0, right: 0, top: 870 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <div style={{ fontSize: 200, transform: `translateY(${Math.sin(frame / 10) * 10}px)` }}>🤲</div>
          <div style={{ transform: `rotate(${Math.sin(frame / 12) * 8}deg) translateY(${Math.cos(frame / 10) * 12}px)` }}>
            <Bill w={220} />
          </div>
        </div>
      </In>
      <In delay={70} from="up" style={{ left: 0, right: 0, top: 1170 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block", background: C.navy, color: "#fff", fontSize: 46, fontWeight: 900, padding: "14px 36px", borderRadius: 999 }}>
            Buka neracamu hari ini 📒
          </span>
        </div>
      </In>
    </AbsoluteFill>
  );
};
