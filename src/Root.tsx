import React from "react";

/*
 * Root menemukan video secara otomatis: setiap folder src/<Nama-Video>/ yang punya
 * file `compositions.tsx` (default export: komponen berisi <Folder>/<Composition>/<Still>)
 * langsung muncul di Remotion Studio dan bisa dirender.
 *
 * Jadi video baru TIDAK perlu didaftarkan di file ini; cukup buat compositions.tsx di foldernya.
 * Folder video yang tidak ada (mis. tidak ikut di-clone) tidak membuat build gagal.
 */

// Tipe untuk require.context (fitur webpack, bundler yang dipakai Remotion).
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Require {
      context(
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp,
      ): { keys(): string[]; (id: string): { default: React.FC } };
    }
  }
}

const ctx = require.context("./", true, /^\.\/[^/]+\/compositions\.tsx$/);

const ENTRIES = ctx
  .keys()
  .filter((k) => k.startsWith("./"))
  .sort()
  .map((k) => ({ key: k, Comp: ctx(k).default }));

export const RemotionRoot: React.FC = () => (
  <>
    {ENTRIES.map(({ key, Comp }) => (
      <Comp key={key} />
    ))}
  </>
);
