import { Composition, Folder } from "remotion";
import { ContohThree, DURATION, FPS } from ".";

/** Composition & still milik video ini. Ditemukan otomatis oleh src/Root.tsx. */
const Compositions: React.FC = () => (
  <Folder name="Contoh-Three">
      <Composition id="ContohThree" component={ContohThree} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
  </Folder>
);

export default Compositions;
