# Cara Menggunakan Three.js bersama Remotion

Panduan singkat memakai objek 3D (three.js) di proyek video ini, termasuk cara meminta bantuan AI agent.

## 1. Yang sudah terpasang

| Paket | Fungsi |
| --- | --- |
| `three` | Mesin 3D (WebGL) |
| `@react-three/fiber` | Menulis scene three.js sebagai komponen React |
| `@remotion/three` | Menyediakan `<ThreeCanvas>` yang sinkron dengan frame Remotion |
| `@types/three` | Tipe TypeScript |

Versi `three` dan `@types/three` dijaga sama (0.187.0). Versi `@remotion/three` harus sama dengan versi `remotion` (4.0.543). Jangan pakai `^`.

`remotion.config.ts` sudah berisi `Config.setChromiumOpenGlRenderer("angle")`. Tanpa ini, WebGL bisa gagal saat render.

## 2. Contoh yang sudah ada

- Kode: `src/Contoh-Three/index.tsx`
- Composition ID: `ContohThree` (vertikal 1080x1920, 30 fps, 5 detik)
- Lihat di Studio: `npm run dev`, lalu pilih `ContohThree`.
- Render:

```bash
npx remotion render ContohThree out/contoh-three/contoh-three.mp4
npx remotion still ContohThree out/contoh-three/contoh-three.png --frame=60
```

## 3. Aturan emas

1. **Pakai `<ThreeCanvas>` dari `@remotion/three`**, bukan `<Canvas>` dari R3F.
2. **Berikan `width` dan `height`** ke `<ThreeCanvas>` (ambil dari `useVideoConfig()`).
3. **Semua animasi berasal dari `useCurrentFrame()`**. Jangan pakai `useFrame()`, `requestAnimationFrame`, `setTimeout`, atau `Date.now()`. Render Remotion mengambil frame satu per satu, jadi animasi berbasis waktu nyata akan kacau.
4. Gerak halus: `spring()` dan `interpolate()` dari Remotion, atau rumus `Math.sin(frame / n)`.
5. **Pakai `<Sequence>` di dalam `<ThreeCanvas>` dengan `layout="none"`** bila perlu mengatur kapan objek muncul.
6. Tekstur dan model: taruh di `public/`, panggil dengan `staticFile("nama.png")`. Jangan memakai URL eksternal yang tidak stabil.
7. Muat aset dengan `useLoader` (tekstur) atau `useGLTF`/`useTexture` dari drei. Remotion otomatis menunggu `useLoader` selesai (`delayRender`). Bila memuat manual, bungkus dengan `delayRender()` dan `continueRender()`.
8. Pencahayaan wajib ada (`ambientLight` dan `directionalLight`). Tanpa lampu, `meshStandardMaterial` tampak hitam.
9. Format vertikal itu sempit. Atur `camera.position` dan skala objek supaya tidak terpotong. Cek dengan `npx remotion still`.

## 4. Pola dasar

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";

const Objek = () => {
  const frame = useCurrentFrame();
  return (
    <mesh rotation={[0, frame / 20, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f28c28" />
    </mesh>
  );
};

export const Scene3D = () => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <Objek />
    </ThreeCanvas>
  );
};
```

Untuk menggabungkan dengan UI 2D (teks, caption), letakkan `<ThreeCanvas>` dan elemen HTML di dalam `<AbsoluteFill>`. Elemen yang muncul belakangan menumpuk di atas. Latar transparan didapat dengan tidak mengisi warna di `<ThreeCanvas>` dan memberi warna pada `AbsoluteFill`.

## 5. Mendaftarkan scene 3D ke video yang ada

1. Buat file `Scene3D.tsx` di folder video, misalnya `src/Harta-Lupa-Dihitung/Scene3D.tsx`.
2. Pakai di `index.tsx` video tersebut, di dalam `<Sequence>` seperti scene lain.
3. Hitung waktu mulai dari `at("id")` di `timeline.ts`, bukan angka frame manual (sesuai `AGENTS.md`).

## 6. Cara bicara kepada agent

Semakin jelas hasil akhirnya, semakin tepat hasilnya. Sebutkan: **video mana**, **scene mana**, **objek apa**, **gerakannya**, **kapan muncul** (kalimat narasi atau detik), dan **gaya visual**.

Contoh yang baik:

- "Di video `Harta-Lupa-Dihitung`, scene piutang, tambahkan koin emas 3D berputar di tengah layar. Muncul saat kalimat 'namanya piutang', membesar dengan spring, lalu berputar pelan. Warna sesuai tema putih/navy/cyan."
- "Buat composisi baru `PiramidaBisnis`, 1080x1920, 8 detik. Tiga balok 3D bertumpuk membentuk piramida, naik satu per satu tiap 1 detik. Kamera berputar pelan mengelilingi. Tanpa audio dulu."
- "Ganti kubus di `src/Contoh-Three` menjadi bola dengan tekstur dari `public/bumi.jpg`. Berputar 360 derajat selama durasi composisi."
- "Render `ContohThree` ke mp4, lalu beri tahu saya lokasi file dan durasinya."

Contoh yang kurang baik (terlalu samar): "Buat yang keren pakai 3D." Agent harus menebak banyak hal.

Tips tambahan:

- Sebut ID composition (misalnya `ContohThree`) agar agent tidak salah file.
- Bila ada aset (tekstur, model `.glb`), sebutkan nama file di `public/`.
- Minta agent mengecek hasilnya: "Jalankan `tsc`, render satu frame, dan tunjukkan."
- Bila hasil kurang pas, kirim koreksi spesifik: "kubus terlalu besar, kecilkan 30%", "putaran terlalu cepat, jadi 1 putaran per 4 detik".
- Render video penuh makan waktu. Minta cek satu frame dulu (`remotion still`), baru render penuh.

## 7. Ide pemakaian di video edukasi bisnis

- Koin atau uang 3D berputar untuk topik keuntungan dan modal.
- Grafik batang 3D yang naik untuk topik pertumbuhan.
- Timbangan atau balok bertumpuk untuk topik neraca.
- Globe atau peta sederhana untuk topik ekspansi bisnis.
- Objek 3D sebagai thumbnail (`<Still>` dengan `ThreeCanvas`).

## 8. Masalah umum

| Gejala | Penyebab dan solusi |
| --- | --- |
| Objek hitam | Tidak ada lampu, atau material butuh cahaya. Tambah `ambientLight` dan `directionalLight`. |
| Objek terpotong | Terlalu besar untuk layar vertikal. Perkecil `scale` atau mundurkan kamera (`position` z lebih besar). |
| Render error WebGL | Pastikan `setChromiumOpenGlRenderer("angle")` ada. Bila masih gagal, coba `"swangle"`. |
| Animasi patah atau melompat | Ada animasi berbasis waktu nyata (`useFrame`). Ganti dengan `useCurrentFrame()`. |
| Tekstur tidak tampil di render | Tekstur belum selesai dimuat. Pakai `useLoader` atau `delayRender`. |
| Peringatan versi tidak cocok | Samakan versi paket `@remotion/*` dengan `remotion` (tanpa `^`). |
| Render lambat | WebGL lebih berat. Turunkan `--concurrency`, kurangi poligon dan jumlah lampu. |

## 9. Referensi

- Dokumentasi Remotion: https://www.remotion.dev/docs/three
- React Three Fiber: https://r3f.docs.pmnd.rs
- Three.js: https://threejs.org/docs
