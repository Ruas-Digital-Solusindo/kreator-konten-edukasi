import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

/** Props standar untuk composition video yang punya versi "share". */
export type ShareProps = {
  /** true = frame 0 menampilkan cover (untuk preview WhatsApp / galeri). Default false (versi unggah). */
  withCover: boolean;
};

export const defaultShareProps: ShareProps = { withCover: false };

/**
 * Tampilkan cover tepat 1 frame di awal video (frame 0), di atas semua layer.
 * Durasi dan audio video tidak berubah; hanya gambar frame pertama yang diganti.
 */
export const CoverFrame: React.FC<{ show: boolean; children: React.ReactNode }> = ({ show, children }) =>
  show ? (
    <Sequence from={0} durationInFrames={1} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  ) : null;
