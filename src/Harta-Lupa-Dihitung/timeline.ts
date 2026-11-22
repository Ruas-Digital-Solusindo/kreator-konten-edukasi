import { spring } from "remotion";

export const FPS = 30;

// Palet: putih + navy → cyan. Merah hanya untuk scene peringatan.
export const C = {
  bg: "#FFFFFF",
  bg2: "#E8F8FC",
  navy: "#0A1A6B",
  brandNavy: "#0A1A8C",
  ink: "#1E2A55",
  muted: "#6B7A99",
  line: "#D5E1EF",
  cyan: "#00B8D9",
  cyanBright: "#00E5FF",
  mid: "#0090D8",
  blue: "#0A6FD8",
  soft: "#EAF6FD",
  red: "#E0342F",
  redDark: "#8F1714",
  redSoft: "#FDECEB",
  paper: "#FFFFFF",
  sepia: "#EFE3C8",
  shadow: "rgba(10,26,107,0.16)",
};

export const FONT = "'Segoe UI', Inter, system-ui, sans-serif";

/**
 * Narasi per frasa. Bungkus kata dengan *...* untuk di-highlight di caption.
 * `sec` / `until` = awal / akhir suara frasa di rekaman (detik).
 */
export type Line = {
  id: string;
  scene: SceneId;
  text: string;
  sec?: number;
  until?: number;
  hold?: number;
};

export const SCENE_IDS = [
  "hook",
  "piutang",
  "dua",
  "uang",
  "penjualan",
  "lainnya",
  "barang",
  "uangmuka",
  "jaminan",
  "dimuka",
  "peringatan",
  "neraca",
  "cta",
] as const;
export type SceneId = (typeof SCENE_IDS)[number];

// sec/until diukur dari public/narasi-harta-lupa-dihitung.mp3 (Whisper + ffmpeg silencedetect)
export const LINES: Line[] = [
  { id: "h1", scene: "hook", sec: 0.05, until: 2.19, text: "Ada harta kamu yang *tidak kelihatan* di toko." },
  { id: "h2", scene: "hook", sec: 2.96, until: 3.98, text: "Tidak ada di *gudang,*" },
  { id: "h3", scene: "hook", sec: 4.24, until: 5.09, text: "tidak ada di *rekening.*" },
  { id: "h4", scene: "hook", sec: 5.78, until: 7.9, text: "Tapi nilainya bisa *puluhan juta.*" },

  { id: "p1", scene: "piutang", sec: 8.53, until: 9.65, text: "Namanya *piutang.*" },
  { id: "p2", scene: "piutang", sec: 10.41, until: 13.51, text: "Sederhananya, harta kamu yang sedang *dipegang orang lain.*" },

  { id: "d1", scene: "dua", sec: 14.26, until: 15.56, text: "Dan bentuknya ada *dua.*" },
  { id: "d2", scene: "dua", sec: 16.11, until: 18.45, text: "Ini perlu *dipisahkan,* supaya tidak keliru." },

  { id: "u1", scene: "uang", sec: 19.12, until: 20.97, text: "Yang pertama, *hak menerima uang.*" },
  { id: "u2", scene: "uang", sec: 21.72, until: 24.57, text: "Ini yang nanti benar-benar kembali jadi *uang tunai.*" },

  { id: "j1", scene: "penjualan", sec: 25.28, until: 27.3, text: "Contoh paling umum, *piutang penjualan.*" },
  { id: "j2", scene: "penjualan", sec: 28.03, until: 29.26, text: "Barang sudah kamu *kirim,*" },
  { id: "j3", scene: "penjualan", sec: 29.62, until: 30.69, text: "nota sudah *ditulis,*" },
  { id: "j4", scene: "penjualan", sec: 31.1, until: 32.56, text: "tapi pelanggan *belum bayar.*" },
  { id: "j5", scene: "penjualan", sec: 33.18, until: 35.45, text: "Di laporan, penjualan itu *sudah dihitung.*" },
  { id: "j6", scene: "penjualan", sec: 36.05, until: 37.89, text: "Di dompet, uangnya *belum ada.*" },

  { id: "l1", scene: "lainnya", sec: 38.58, until: 39.8, text: "Ada juga *piutang lainnya.*" },
  { id: "l2", scene: "lainnya", sec: 40.34, until: 43.4, text: "*Karyawan pinjam uang,* dipotong dari gaji bulan depan." },
  { id: "l3", scene: "lainnya", sec: 44.05, until: 47.47, text: "Atau *pajak yang kamu bayar lebih,* dan akan dikembalikan." },

  { id: "b1", scene: "barang", sec: 48.3, until: 51.08, text: "Yang kedua, *hak menerima barang atau jasa.*" },
  { id: "b2", scene: "barang", sec: 51.64, until: 54.79, text: "Ini tetap harta kamu, tapi kembalinya *bukan uang.*" },

  { id: "m1", scene: "uangmuka", sec: 55.45, until: 57.14, text: "Contohnya *uang muka pembelian.*" },
  { id: "m2", scene: "uangmuka", sec: 57.73, until: 59.09, text: "Kamu sudah *bayar* ke pemasok," },
  { id: "m3", scene: "uangmuka", sec: 59.53, until: 60.56, text: "barangnya *belum datang.*" },

  { id: "g1", scene: "jaminan", sec: 61.24, until: 62.32, text: "Lalu *uang jaminan.*" },
  { id: "g2", scene: "jaminan", sec: 62.85, until: 63.95, text: "*Deposit sewa kios,*" },
  { id: "g3", scene: "jaminan", sec: 64.3, until: 66.86, text: "atau jaminan *krat dan tabung* dari distributor." },
  { id: "g4", scene: "jaminan", sec: 67.51, until: 68.96, text: "Uang itu *tetap milikmu,*" },
  { id: "g5", scene: "jaminan", sec: 69.39, until: 72.07, text: "cuma *dititipkan* selama kerja sama masih jalan." },

  { id: "k1", scene: "dimuka", sec: 72.81, until: 73.99, text: "Dan *pembayaran di muka,*" },
  { id: "k2", scene: "dimuka", sec: 74.3, until: 77.09, text: "misalnya *sewa setahun* yang dibayar sekaligus." },
  { id: "k3", scene: "dimuka", sec: 77.57, until: 79.41, text: "Yang ini *tidak kembali* jadi uang." },
  { id: "k4", scene: "dimuka", sec: 79.96, until: 81.08, text: "Tapi *tetap harta,*" },
  { id: "k5", scene: "dimuka", sec: 81.47, until: 84.84, text: "karena kamu *tidak perlu bayar sewa lagi* sampai tahun depan." },

  { id: "w1", scene: "peringatan", sec: 85.61, until: 86.31, text: "*Satu hal penting.*" },
  { id: "w2", scene: "peringatan", sec: 86.94, until: 88.97, text: "Piutang yang *bertahun-tahun tidak tertagih,*" },
  { id: "w3", scene: "peringatan", sec: 89.3, until: 90.44, text: "itu *bukan harta lagi.*" },
  { id: "w4", scene: "peringatan", sec: 91.0, until: 93.11, text: "Itu *kerugian* yang belum kamu akui." },
  { id: "w5", scene: "peringatan", sec: 93.82, until: 95.17, text: "Dan selama *belum diakui,*" },
  { id: "w6", scene: "peringatan", sec: 95.43, until: 98.16, text: "usahamu terlihat *lebih kaya* daripada kenyataannya." },

  { id: "n1", scene: "neraca", sec: 99.12, until: 101.03, text: "Semua yang tadi ada di *neracamu,*" },
  { id: "n2", scene: "neraca", sec: 101.44, until: 103.17, text: "di sisi kiri, *bagian harta.*" },
  { id: "n3", scene: "neraca", sec: 103.88, until: 105.22, text: "Coba *buka neracamu* hari ini," },
  { id: "n4", scene: "neraca", sec: 105.7, until: 106.38, text: "dan *jumlahkan.*" },

  { id: "c1", scene: "cta", sec: 107.01, until: 110.88, text: "Jadi, berapa harta kamu yang sekarang *masih ada di tangan orang lain?*", hold: 2.5 },
];

const WPS = 2.7;
const PAUSE = 0.35;
const SCENE_PAUSE = 0.4;

export type Timed = Line & { start: number; end: number; speakEnd: number; words: string[] };

const buildTimeline = () => {
  const out: Timed[] = [];
  let t = 0.3;
  LINES.forEach((l, i) => {
    const words = l.text.split(/\s+/).filter(Boolean);
    const startSec = l.sec ?? t;
    const next = LINES[i + 1];
    const speakEndSec = l.until ?? startSec + words.length / WPS;
    let endSec = speakEndSec + PAUSE + (l.hold ?? 0);
    if (next && next.scene !== l.scene) endSec += SCENE_PAUSE;
    if (next?.sec !== undefined) endSec = next.sec;
    out.push({
      ...l,
      words,
      start: Math.round(startSec * FPS),
      end: Math.round(endSec * FPS),
      speakEnd: Math.round(speakEndSec * FPS),
    });
    t = endSec;
  });
  return out;
};

export const TL = buildTimeline();
export const SEG: Record<string, Timed> = Object.fromEntries(TL.map((l) => [l.id, l]));

const sceneRange = (id: SceneId) => {
  const ls = TL.filter((l) => l.scene === id);
  return { start: ls[0].start, end: ls[ls.length - 1].end };
};

export const SCENES = Object.fromEntries(SCENE_IDS.map((id) => [id, sceneRange(id)])) as Record<
  SceneId,
  { start: number; end: number }
>;
SCENES.hook.start = 0;

/** Outro brand (Ruas Accounting + tagline), tanpa suara. */
export const OUTRO_SEC = 4;
export const OUTRO = { start: TL[TL.length - 1].end, end: TL[TL.length - 1].end + Math.round(OUTRO_SEC * FPS) };
export const LOGO_SRC = "ruas-logo.png";

export const DURATION = OUTRO.end;

/** Frame (relatif terhadap scene-nya) saat sebuah baris narasi mulai. */
export const at = (id: string) => SEG[id].start - SCENES[SEG[id].scene].start;
/** Frame (relatif terhadap scene-nya) saat suara sebuah baris selesai. */
export const atEnd = (id: string) => SEG[id].speakEnd - SCENES[SEG[id].scene].start;
export const sceneLen = (id: SceneId) => SCENES[id].end - SCENES[id].start;

export const NARASI_SRC: string | null = "narasi-harta-lupa-dihitung.mp3";

export const pop = (
  frame: number,
  fps: number,
  delay: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) => spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120, ...config } });

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const clampP = (v: number) => Math.max(0, Math.min(1, v));
