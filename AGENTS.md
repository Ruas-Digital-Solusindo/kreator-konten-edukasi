# Video Creator: panduan untuk AI agent

Proyek Remotion untuk video edukasi bisnis berbahasa Indonesia (Instagram Reels, YouTube Shorts, TikTok).
Format utama: vertikal 1080×1920, 30 fps. Ditambah thumbnail vertikal 1080×1920 dan landscape 1280×720.

## Struktur

- `src/Root.tsx` **menemukan video otomatis**: setiap folder `src/<Nama-Video>/` yang punya `compositions.tsx` langsung terdaftar. Jangan mengedit `Root.tsx` untuk menambah video.
- Satu video berada di satu folder `src/<Nama-Video>/`. Contoh paling lengkap (dan satu-satunya yang ada di repo): `src/Harta-Lupa-Dihitung/`.
  - `compositions.tsx` (wajib): default export komponen berisi `<Folder name="<Nama-Video>">` dengan `<Composition>` video dan semua `<Still>` (cover & thumbnail).
  - `timeline.ts` berisi warna (`C`), `LINES` (naskah per kalimat dengan `sec`/`until`), `SCENES`, `DURATION`, `NARASI_SRC`, dan helper `at(id)`.
  - `index.tsx` berisi background, caption karaoke, progress bar, scene, outro, dan `<Audio>` narasi.
  - `Scene*.tsx` berisi satu file per scene. Beat di dalamnya memakai `at("id")`. Jangan menulis angka frame manual yang bergantung pada narasi; hitung dari `at()`.
  - `Thumbnail.tsx` berisi thumbnail landscape (dan bagian visual yang dipakai ulang); `Covers.tsx` berisi cover per platform.
- Naskah, catatan, dan rekaman dari user ada di `narasi/<JUDUL>/` (`catatan.txt` + `.mp3`). Contoh format: `narasi/HARTA-YANG-LUPA-DIHITUNG/catatan.txt`.
- `public/` berisi narasi `narasi-<nama>.mp3` dan logo `ruas-logo.png` (dipakai di outro).
  - Repo ini **publik**: audio (`*.mp3` dll.), foto orang/pihak ketiga, dan `src/**/contoh-gambar/` di-ignore git. Jangan menambahkan file seperti itu ke git (jangan `git add -f`). Bila menambah foto orang baru, tambahkan juga ke `.gitignore`.
  - Repo hanya berisi alat, aturan, dan satu contoh video. Folder video baru (`src/<Nama-Video>/`, `narasi/<JUDUL>/`) otomatis di-ignore dan tetap lokal. Jangan menambah pengecualian `!src/...` di `.gitignore` kecuali user memintanya.
- `out/` berisi hasil render (`.mp4`, `.srt`, thumbnail `.png`). Folder ini di-ignore git.
  - **Setiap video punya subfolder sendiri: `out/<nama-video>/`** (huruf kecil, pakai tanda hubung, contoh `out/harta-lupa-dihitung/`). Semua output video itu (mp4, srt, thumbnail, cover per platform, log render) ditulis ke sana. Jangan menaruh file output langsung di `out/`.
  - Remotion membuat folder tujuan otomatis, jadi cukup tulis path lengkapnya di perintah render.

## Alur membuat video baru

1. Baca naskah di `catatan.txt`, lalu pecah per kalimat ke `LINES` di `timeline.ts`. Bungkus kata penting dengan `*...*` agar di-highlight di caption.
2. Selama rekaman belum ada, isi `sec`/`until` dengan perkiraan.
3. Bila user butuh teks untuk tools text-to-voice, berikan naskah lengkap plus versi SRT dengan perkiraan detik.
4. Setelah `public/narasi-<nama>.mp3` ada, ukur detik aslinya dengan Whisper (lihat di bawah). Perbarui `sec`/`until` semua baris, lalu set `NARASI_SRC`.
5. Samakan teks caption dengan yang benar-benar diucapkan di rekaman.
6. Jalankan `npx tsc --noEmit`, lalu render output **dengan urutan wajib di bawah** (tanpa perlu diminta user).

## Urutan render (wajib, otomatis)

Thumbnail selalu dibuat **sebelum** mp4, karena versi share memakai cover yang sudah jadi.

1. **Thumbnail dulu:** `cover-instagram.png`, `cover-tiktok.png`, `cover-shorts.png`, dan `thumbnail-landscape.png` (lihat bagian cover per platform di bawah). Cek zona amannya.
2. **mp4 versi unggah (bersih):** `out/<nama>/<nama>.mp4`. Dipakai untuk diunggah ke TikTok, Instagram, dan YouTube; cover dipilih di aplikasinya.
3. **mp4 versi share:** `out/<nama>/<nama>-share.mp4`, dibuat dengan
   ```bash
   bash tools/make-share.sh <CompositionId> <nama>
   ```
   Hasilnya: frame 0 = cover (preview WhatsApp / galeri HP) dan `cover-instagram.png` tertanam sebagai cover art (thumbnail File Explorer).
4. **`.srt`:** `out/<nama>/<nama>.srt`.

Syarat di kode agar langkah 3 jalan (pola: `src/Harta-Lupa-Dihitung/index.tsx`):
- Komponen video menerima `ShareProps` dari `src/shared/CoverFrame.tsx` dan menaruh `<CoverFrame show={withCover}><NamaCoverInstagram /></CoverFrame>` sebagai layer **paling akhir**.
- `<Composition>` di `compositions.tsx` diberi `defaultProps={defaultShareProps}` (default `withCover: false`, jadi versi unggah tetap bersih).
- Cek frame 0 versi share: `ffmpeg -i out/<nama>/<nama>-share.mp4 -frames:v 1 cek.png` harus sama dengan cover.

Isi akhir `out/<nama>/`: `<nama>.mp4`, `<nama>-share.mp4`, `<nama>.srt`, `cover-instagram.png`, `cover-tiktok.png`, `cover-shorts.png`, `thumbnail-landscape.png`.

## Thumbnail: wajib satu cover per platform

Satu thumbnail vertikal sering tidak terbaca di salah satu platform, karena tiap platform memotong grid dan menutup layar di tempat berbeda. Karena itu **setiap video baru (atau video yang diubah) selalu dibuatkan tiga cover 1080×1920 tanpa perlu diminta**, ditambah thumbnail landscape 1280×720 untuk YouTube biasa.

| Platform | Still ID | File output | Zona aman judul |
|---|---|---|---|
| Instagram Reels | `<Nama>CoverInstagram` | `out/<nama>/cover-instagram.png` | Judul + visual utama di kotak 1:1 tengah (y 420–1500). Grid profil memotong 3:4 tengah (y 240–1680); teks tambahan boleh di situ. |
| TikTok | `<Nama>CoverTiktok` | `out/<nama>/cover-tiktok.png` | Potongan 3:4 tengah (y 240–1680). Kosongkan kolom ikon kanan (x > 930, y 700–1500), bawah (y > 1480), dan atas (y < 150). |
| YouTube Shorts | `<Nama>CoverShorts` | `out/<nama>/cover-shorts.png` | Judul di bagian atas. Kosongkan bawah (y > 1420) untuk judul video + nama kanal, dan tombol kanan (x > 920, y 880–1600). |

- Contoh kerja: `src/Harta-Lupa-Dihitung/Covers.tsx`. Satu komponen `Cover` dipakai dengan tata letak berbeda per platform. Daftarkan ketiganya sebagai `<Still>` di `compositions.tsx` video itu.
- Judul memakai teks dari `catatan.txt` (bagian "Judul thumbnail"). Huruf tebal dan besar (baris utama ±230–270 px), warna gelap/kontras; hindari warna terang (misalnya cyan muda) untuk kata utama.
- Wajib dicek sebelum selesai: render ketiganya, lalu tumpuk kotak zona tertutup UI (ffmpeg `drawbox`) dan potongan grid (1:1 untuk Instagram, 3:4 untuk TikTok), kecilkan ke ±200 px lebar, dan pastikan judul tidak terpotong, tidak tertutup, dan masih terbaca.

## Whisper: mengukur detik narasi (sudah terpasang)

- Model: `tools/whisper/ggml-small.bin` (sekitar 466 MB, di-ignore git). Bila belum ada (mis. clone baru), unduh sekali dengan `bash tools/whisper/download-model.sh`. **Jangan unduh ulang bila file sudah ada.**
- Dijalankan lewat filter `whisper` bawaan ffmpeg (butuh FFmpeg 8+ dengan `--enable-whisper`; cek `ffmpeg -filters | grep whisper`). Python Whisper tidak diperlukan.
- Jalankan dari folder utama repo (folder yang berisi `package.json`):

  ```bash
  bash tools/whisper/measure.sh public/narasi-<nama>.mp3
  ```

  Hasilnya:
  - `tools/whisper/out/<nama>.json` berisi transkrip per segmen (`start`/`end` dalam milidetik).
  - `<nama>.silence.txt` berisi daftar jeda.
- Batas segmen Whisper kasar, kadang menggabungkan dua kalimat. Pakai transkrip untuk tahu kalimat mana yang diucapkan kapan. Pakai jeda dari silencedetect untuk `sec` (awal suara) dan `until` (akhir suara) yang presisi.

## Three.js (objek 3D)

Terpasang: `three`, `@react-three/fiber`, `@remotion/three`, `@types/three`. Panduan lengkap ada di `tutorial/three-js-dengan-remotion.md`; contoh kerja di `src/Contoh-Three/` (composition `ContohThree`, tanpa aset).

- Pakai `<ThreeCanvas width height>` dari `@remotion/three`, bukan `<Canvas>` milik R3F.
- Semua animasi dihitung dari `useCurrentFrame()`, `spring()`, atau `interpolate()`. Jangan pakai `useFrame`, `requestAnimationFrame`, atau `Date.now()`.
- Selalu beri lampu (`ambientLight` dan `directionalLight`), dan cek objek tidak terpotong di format vertikal 1080×1920 (`npx remotion still`).
- Aset (tekstur, `.glb`) taruh di `public/` dan panggil dengan `staticFile()`.
- Waktu muncul objek 3D di video narasi dihitung dari `at("id")`, bukan angka frame manual.
- `remotion.config.ts` memakai `setChromiumOpenGlRenderer("angle")`. Jangan dihapus. Bila WebGL gagal saat render, coba `"swangle"`.
- Versi `three` dan `@types/three` harus sama. Versi `@remotion/*` harus sama dengan `remotion` dan ditulis tanpa `^`.

## Perintah

```bash
npm run dev                                                    # Remotion Studio
npx tsc --noEmit                                               # cek tipe
npx remotion render <CompositionId> out/<nama>/<nama>.mp4 --overwrite             # render video
npx remotion still <Nama>CoverInstagram out/<nama>/cover-instagram.png --overwrite  # cover (juga Tiktok, Shorts)
npx remotion still <Nama>ThumbLandscape out/<nama>/thumbnail-landscape.png --overwrite
bash tools/make-share.sh <CompositionId> <nama>                                    # mp4 versi share
node tools/make-srt.mjs src/<Nama-Video>/timeline.ts out/<nama>/<nama>.srt         # buat .srt
```

Render video memakan waktu beberapa menit, jadi jalankan di background.

## Konvensi

- Teks di layar dan caption memakai bahasa Indonesia. Nama variabel boleh bahasa Inggris.
- Gaya visual: latar krem, aksen navy/oranye, kartu membulat, karakter flat sederhana. Ikuti video yang sudah ada.
- Setiap video diakhiri outro logo selama 4 detik (`OUTRO_SEC`).
