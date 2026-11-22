import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Beat, Bill, Grad, Head, HangTag, In, Panel, SplitBoard, Strike, TopChip, Truck } from "./components";
import { at, atEnd, C, clamp, pop, sceneLen } from "./timeline";

const rupiah = (n: number) => "Rp " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* ------------------------------------------------------------------ */
/* 1. HOOK: toko, gudang, rekening dicoret                              */
/* ------------------------------------------------------------------ */
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const places = [
    { e: "🏪", t: "TOKO", x: 60, d: 6, s: atEnd("h1") - 14 },
    { e: "🏭", t: "GUDANG", x: 395, d: 12, s: at("h2") + 14 },
    { e: "🏦", t: "REKENING", x: 730, d: 18, s: at("h3") + 14 },
  ];
  const h4 = at("h4");
  const count = interpolate(frame, [h4 + 4, h4 + 50], [0, 47_500_000], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const shake = frame > h4 + 50 && frame < h4 + 62 ? Math.sin(frame * 2) * 6 : 0;
  return (
    <AbsoluteFill>
      <Head top={170} size={62}>
        Ada harta kamu yang
      </Head>
      <Head top={250} size={86} delay={6}>
        <Grad>TIDAK KELIHATAN</Grad>
      </Head>
      {places.map((p) => (
        <In key={p.t} delay={p.d} from="scale" style={{ left: p.x, top: 450 }}>
          <Panel style={{ width: 290, height: 330, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }}>
            <div style={{ fontSize: 140, opacity: frame > p.s + 6 ? 0.45 : 1 }}>{p.e}</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: C.navy, letterSpacing: 2 }}>{p.t}</div>
            <Strike delay={p.s} color={C.navy} width={16} rot={-28} />
            <Strike delay={p.s + 4} color={C.navy} width={16} rot={28} />
          </Panel>
        </In>
      ))}
      <In delay={h4} from="up" style={{ left: 0, right: 0, top: 900 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: C.muted }}>tapi nilainya bisa</div>
          <div
            style={{
              display: "inline-block",
              marginTop: 18,
              padding: "26px 50px",
              borderRadius: 34,
              background: `linear-gradient(135deg, ${C.brandNavy}, ${C.mid} 60%, ${C.cyan})`,
              color: "#fff",
              fontSize: 104,
              fontWeight: 900,
              boxShadow: `0 24px 50px ${C.shadow}`,
              transform: `translateX(${shake}px)`,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {rupiah(count)}
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, color: C.navy, marginTop: 24, letterSpacing: 3 }}>
            <Grad>PULUHAN JUTA</Grad>
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2. PIUTANG: uang berpindah dari tanganmu ke tangan orang lain        */
/* ------------------------------------------------------------------ */
export const ScenePiutang: React.FC = () => {
  const frame = useCurrentFrame();
  const p2 = at("p2");
  const t = interpolate(frame, [p2 + 8, p2 + 44], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const x = interpolate(t, [0, 1], [215, 735]);
  const y = 720 - Math.sin(t * Math.PI) * 220;
  const rot = interpolate(t, [0, 1], [-12, 10]);
  return (
    <AbsoluteFill>
      <Head top={200} size={190}>
        <Grad>PIUTANG</Grad>
      </Head>
      <Head top={420} size={50} delay={p2} color={C.ink}>
        harta kamu yang <b style={{ color: C.mid }}>dipegang orang lain</b>
      </Head>
      <In delay={6} from="left" style={{ left: 60, top: 960 }}>
        <Badge emoji="🙂" label="KAMU" />
      </In>
      <In delay={12} from="right" style={{ left: 710, top: 960 }}>
        <Badge emoji="🧑‍💼" label="ORANG LAIN" bg="#fff" />
      </In>
      {/* panah lintasan */}
      <In delay={p2} from="scale" style={{ left: 330, top: 560 }}>
        <svg width={420} height={160} viewBox="0 0 420 160">
          <path d="M10 150 Q210 -40 410 150" fill="none" stroke={C.cyan} strokeWidth={8} strokeDasharray="22 16" strokeLinecap="round" />
        </svg>
      </In>
      {frame >= p2 && (
        <div style={{ position: "absolute", left: x - 10, top: y, transform: `rotate(${rot}deg)` }}>
          <Bill w={190} />
          <div style={{ position: "absolute", left: 50, top: 92 }}>
            <HangTag text="MILIKMU" delay={p2 + 46} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3. DUA BENTUK                                                        */
/* ------------------------------------------------------------------ */
export const SceneDua: React.FC = () => (
  <AbsoluteFill>
    <TopChip>PIUTANG ADA 2 BENTUK</TopChip>
    <SplitBoard focus="none" divideAt={at("d2")} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 4. BENTUK 1: hak menerima uang, uang kembali ke kas                  */
/* ------------------------------------------------------------------ */
const CashReturn: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [delay, delay + 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wallet = pop(frame, fps, delay - 10, { damping: 10 });
  const bump = pop(frame, fps, delay + 28, { damping: 7, stiffness: 200 });
  const sc = frame > delay + 28 ? 1 + 0.12 * Math.sin(bump * Math.PI) : 1;
  if (frame < delay - 10) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 590,
          top: 170,
          width: 300,
          height: 260,
          borderRadius: 40,
          background: "#fff",
          border: `6px solid ${C.navy}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${wallet * sc})`,
          color: C.navy,
        }}
      >
        <div style={{ fontSize: 120 }}>👛</div>
        <div style={{ fontSize: 36, fontWeight: 900, whiteSpace: "nowrap" }}>UANG TUNAI</div>
      </div>
      {t < 1 && (
        <div style={{ position: "absolute", left: interpolate(t, [0, 1], [-220, 650]), top: 240 + Math.sin(t * Math.PI) * -60, opacity: 1 - t * 0.6 }}>
          <Bill w={170} />
        </div>
      )}
    </>
  );
};

export const SceneUang: React.FC = () => (
  <AbsoluteFill>
    <TopChip>YANG PERTAMA</TopChip>
    <SplitBoard focus="top" focusAt={6} divideAt={0} topExtra={<CashReturn delay={at("u2") + 6} />} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 5. PIUTANG PENJUALAN                                                 */
/* ------------------------------------------------------------------ */
const NotaRow: React.FC<{ k: string; v: string; bold?: boolean }> = ({ k, v, bold }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: bold ? 900 : 600, color: C.ink, padding: "8px 0", borderBottom: `3px dashed ${C.line}` }}>
    <span>{k}</span>
    <span>{v}</span>
  </div>
);

export const ScenePenjualan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j2 = at("j2");
  const j3 = at("j3");
  const j4 = at("j4");
  const j5 = at("j5");
  const j6 = at("j6");
  const drive = interpolate(frame, [j2, j2 + 32], [-380, 300], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blink = frame > j4 ? 0.5 + 0.5 * Math.sin((frame - j4) / 3) : 0;
  const sent = pop(frame, fps, j3 + 22, { damping: 9 });
  return (
    <AbsoluteFill>
      <TopChip>PIUTANG PENJUALAN</TopChip>
      <Beat from={0} to={j5}>
        {/* jalan + truk + pelanggan */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 545, height: 8, borderRadius: 4, background: `repeating-linear-gradient(90deg, ${C.navy}55 0 40px, transparent 40px 70px)` }} />
        <In delay={6} from="scale" style={{ left: 760, top: 290 }}>
          <Badge emoji="🏪" label="PELANGGAN" size={180} />
        </In>
        <div style={{ position: "absolute", left: drive, top: 340 }}>
          <Truck w={360} wheelTurn={drive * 1.2} />
        </div>
        {/* nota */}
        <In delay={j3} from="up" style={{ left: 110, top: 640 }}>
          <Panel style={{ width: 860, padding: "34px 46px", transform: "rotate(-1.5deg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 60, fontWeight: 900, color: C.navy, letterSpacing: 4 }}>NOTA</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: C.muted }}>No. 0127</div>
            </div>
            <NotaRow k="20 krat minuman" v="Rp 8.400.000" />
            <NotaRow k="Kepada" v="Toko Sumber Rejeki" />
            <div style={{ display: "flex", gap: 26, marginTop: 26 }}>
              <div style={{ flex: 1, borderRadius: 22, border: `5px solid ${C.navy}`, padding: "18px 0", textAlign: "center", background: sent > 0 ? `linear-gradient(135deg, ${C.mid}, ${C.cyan})` : "#fff", color: "#fff" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: sent > 0 ? "#fff" : C.navy }}>DIKIRIM</div>
                <div style={{ fontSize: 70, fontWeight: 900, transform: `scale(${sent})` }}>✔</div>
              </div>
              <div
                style={{
                  flex: 1,
                  borderRadius: 22,
                  border: `5px dashed ${C.navy}`,
                  padding: "18px 0",
                  textAlign: "center",
                  boxShadow: `0 0 ${50 * blink}px ${C.cyanBright}`,
                  background: "#fff",
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 800, color: C.navy }}>LUNAS</div>
                <div style={{ fontSize: 70, fontWeight: 900, color: C.line }}>—</div>
              </div>
            </div>
          </Panel>
        </In>
      </Beat>
      <Beat from={j5} to={sceneLen("penjualan")}>
        <In delay={4} from="left" style={{ left: 60, top: 380 }}>
          <Panel style={{ width: 450, height: 640, padding: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 46, fontWeight: 900, color: C.muted, letterSpacing: 3 }}>DI LAPORAN</div>
            <div style={{ fontSize: 150 }}>📊</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.ink }}>Penjualan</div>
            <div style={{ fontSize: 60, fontWeight: 900, color: C.navy }}>Rp 8,4 jt</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", background: C.mid, borderRadius: 999, padding: "8px 30px" }}>✔ DIHITUNG</div>
          </Panel>
        </In>
        <In delay={j6 - j5} from="right" style={{ left: 570, top: 380 }}>
          <Panel style={{ width: 450, height: 640, padding: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 46, fontWeight: 900, color: C.muted, letterSpacing: 3 }}>DI DOMPET</div>
            <div style={{ fontSize: 150 }}>👛</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.ink }}>Uang masuk</div>
            <div style={{ fontSize: 60, fontWeight: 900, color: C.navy }}>Rp 0</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: C.navy, border: `4px dashed ${C.navy}`, borderRadius: 999, padding: "6px 30px" }}>BELUM ADA</div>
          </Panel>
        </In>
      </Beat>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6. PIUTANG LAINNYA: kasbon karyawan + pajak lebih bayar              */
/* ------------------------------------------------------------------ */
export const SceneLainnya: React.FC = () => {
  const frame = useCurrentFrame();
  const l2 = at("l2");
  const l3 = at("l3");
  const hl = interpolate(frame, [l2 + 40, l2 + 52], [0, 1], clamp);
  const row = (k: string, v: string, extra?: React.CSSProperties) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 700, color: C.ink, padding: "12px 18px", borderRadius: 14, ...extra }}>
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <TopChip>PIUTANG LAINNYA</TopChip>
      <In delay={l2} from="left" style={{ left: 70, top: 300 }}>
        <Panel style={{ width: 940, padding: "30px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 14 }}>
            <div style={{ fontSize: 90 }}>🧑‍🔧</div>
            <div>
              <div style={{ fontSize: 52, fontWeight: 900, color: C.navy }}>SLIP GAJI</div>
              <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>Karyawan · bulan depan</div>
            </div>
          </div>
          {row("Gaji pokok", "Rp 3.000.000")}
          {row("Potong kasbon", "− Rp 500.000", {
            background: `rgba(0,184,217,${0.22 * hl})`,
            border: `4px solid rgba(0,144,216,${hl})`,
            color: C.navy,
            fontWeight: 900,
            transform: `scale(${1 + 0.03 * hl})`,
          })}
          {row("Diterima", "Rp 2.500.000", { borderTop: `3px solid ${C.line}`, fontWeight: 900 })}
        </Panel>
      </In>
      <In delay={l3} from="right" style={{ left: 70, top: 900 }}>
        <Panel style={{ width: 940, padding: "30px 40px", display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ fontSize: 120 }}>🧾</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.muted, letterSpacing: 2 }}>PAJAK</div>
            <div style={{ fontSize: 54, fontWeight: 900, color: C.navy }}>Lebih bayar</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: C.ink }}>Rp 1.200.000</div>
          </div>
        </Panel>
      </In>
      <In delay={l3 + 60} from="scale" style={{ left: 560, top: 1160 }}>
        <div style={{ background: `linear-gradient(90deg, ${C.mid}, ${C.cyan})`, color: "#fff", fontWeight: 900, fontSize: 42, padding: "14px 30px", borderRadius: 999, border: `4px solid ${C.navy}`, transform: "rotate(-4deg)" }}>
          ↩ DIKEMBALIKAN
        </div>
      </In>
    </AbsoluteFill>
  );
};
