# Video Creator

Workspace untuk membuat video edukasi bisnis berbahasa Indonesia dengan [Remotion](https://www.remotion.dev) (React → video).
Format utama vertikal 1080×1920, 30 fps, untuk Instagram Reels, TikTok, dan YouTube Shorts. Setiap video dilengkapi cover per platform, thumbnail landscape, file `.srt`, dan versi mp4 untuk dibagikan (WhatsApp).

Workspace ini dirancang untuk dikerjakan bersama AI agent (Claude Code, Codex, dll.). Aturan kerjanya ada di [`AGENTS.md`](AGENTS.md); `CLAUDE.md` hanya merujuk ke file itu.

Repo ini berisi alat, aturan, dan satu contoh video (`src/Harta-Lupa-Dihitung/`). Video yang Anda buat sendiri tetap di laptop Anda dan tidak ikut ter-upload.

---

## 1. Yang perlu dipasang di komputer (di luar repo)

| Aplikasi | Wajib? | Untuk apa | Cara pasang (Windows) |
|---|---|---|---|
| **Node.js 22 LTS** (atau 20.19+ / 24+) | Wajib | Menjalankan Remotion | `winget install OpenJS.NodeJS.LTS` atau [nodejs.org](https://nodejs.org) |
| **Git** (termasuk **Git Bash**) | Wajib | Clone repo, menjalankan script `.sh` di `tools/` | `winget install Git.Git` |
| **FFmpeg 8+ dengan filter `whisper`** | Wajib | Mengukur detik narasi, membuat versi share, cek thumbnail | `winget install Gyan.FFmpeg` (build *full* sudah berisi whisper) |
| Koneksi internet saat render pertama | Sekali | Remotion mengunduh Chrome Headless Shell otomatis | - |

Cek FFmpeg sudah benar:

```bash
ffmpeg -hide_banner -filters | grep whisper
# harus muncul:  whisper  A->A  Transcribe audio using whisper.cpp.
```

macOS / Linux juga bisa (Node, Git, FFmpeg dari Homebrew/apt), asalkan FFmpeg versi 8+ yang dibangun dengan `--enable-whisper`. Font **Segoe UI** dan emoji Windows dipakai di desain, jadi tampilan di Mac/Linux bisa sedikit berbeda.

Tidak perlu Python. Whisper berjalan lewat FFmpeg.

## 2. Setup pertama kali

```bash
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>
npm install                              # wajib, sekali (dan setiap package.json berubah)
bash tools/whisper/download-model.sh     # model Whisper ~466 MB, sekali saja
```

`git clone` membuat folder bernama sama dengan repo. Semua perintah di README dan `AGENTS.md` dijalankan dari **folder utama repo** itu (folder yang berisi `package.json`). Nama foldernya boleh diganti sesuka Anda; tidak ada script yang bergantung pada nama folder.

Di Windows, jalankan perintah `bash ...` dari **Git Bash** (atau terminal yang punya `bash`).

## 3. Menjalankan

```bash
npm run dev                # buka Remotion Studio (preview & edit) di browser
npx tsc --noEmit           # cek tipe
```

## 4. Membuat video baru

1. Buat folder `narasi/<JUDUL>/` berisi `catatan.txt` (naskah, judul thumbnail, visual, warna) dan rekaman `.mp3`. Lihat contoh format di `narasi/HARTA-YANG-LUPA-DIHITUNG/catatan.txt`.
2. Buka workspace ini di Claude Code (atau agent lain), lalu minta: *"buat video baru dari narasi/&lt;JUDUL&gt;"*.
3. Agent mengikuti `AGENTS.md`: mengukur narasi dengan Whisper, membuat `src/<Nama-Video>/`, lalu merender cover, mp4, versi share, dan `.srt` ke `out/<nama-video>/`.

Video baru otomatis muncul di Remotion Studio (tidak perlu mengedit `src/Root.tsx`), dan otomatis tidak ikut ter-upload ke git.

## 5. Yang tidak ada di repo

Sengaja tidak di-upload (lihat `.gitignore`): audio narasi dan rekaman, foto orang/pihak ketiga, model Whisper, hasil render (`out/`), serta proyek video selain contoh. Karena audionya tidak ada, contoh `HartaLupaDihitung` hanya bisa dilihat kodenya dan dirender cover/thumbnail-nya. Untuk merender videonya, taruh rekaman Anda sendiri di `public/`.

## 6. Struktur folder

```
src/<Nama-Video>/   kode satu video (compositions.tsx, timeline.ts, index.tsx, Scene*.tsx, Covers.tsx, Thumbnail.tsx)
src/shared/         komponen bersama (mis. CoverFrame untuk versi share)
src/Root.tsx        menemukan semua video otomatis
narasi/             naskah & rekaman per video
public/             aset statis: logo, audio narasi
tools/              script: Whisper, SRT, versi share, dll.
tutorial/           catatan teknis (mis. Three.js dengan Remotion)
out/                hasil render, satu folder per video
```

## Lisensi

- **Kode di repo ini: [MIT](LICENSE).** Bebas dipakai, diubah, dan dipakai komersial, asal pemberitahuan hak cipta di file `LICENSE` tetap disertakan.
- **Logo & nama "Ruas Accounting"** (`public/ruas-logo.png`, `public/ruas-accounting-end.png`) adalah merek dagang dan **tidak termasuk** lisensi MIT. Ganti dengan logo Anda sendiri untuk video Anda.
- **Remotion dan library lain** (React, three.js, dll.) tetap di bawah lisensinya masing-masing; MIT di repo ini tidak mengubahnya. Library-library itu tidak ada di repo, melainkan diunduh lewat `npm install`.
  - **Remotion** gratis untuk perorangan dan perusahaan kecil (≤ 3 orang). Perusahaan yang lebih besar butuh lisensi perusahaan Remotion, meskipun kode repo ini MIT. Lihat [syarat lisensi Remotion](https://www.remotion.dev/license).
- **Konten video yang Anda buat** (naskah, suara, gambar) adalah milik dan tanggung jawab Anda. Bila suara dibuat dengan aplikasi text-to-speech, cek izin pemakaian komersial dari layanan tersebut.
