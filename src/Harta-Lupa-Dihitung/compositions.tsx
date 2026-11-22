import { Composition, Folder, Still } from "remotion";
import { HartaLupaDihitung } from ".";
import { defaultShareProps } from "../shared/CoverFrame";
import { HartaLupaCoverInstagram, HartaLupaCoverShorts, HartaLupaCoverTiktok } from "./Covers";
import { HartaLupaThumbLandscape, HartaLupaThumbVertical } from "./Thumbnail";
import { DURATION, FPS } from "./timeline";

/** Composition & still milik video ini. Ditemukan otomatis oleh src/Root.tsx. */
const Compositions: React.FC = () => (
  <Folder name="Harta-Lupa-Dihitung">
      <Composition id="HartaLupaDihitung" component={HartaLupaDihitung} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={defaultShareProps} />
      <Still id="HartaLupaCoverInstagram" component={HartaLupaCoverInstagram} width={1080} height={1920} />
      <Still id="HartaLupaCoverTiktok" component={HartaLupaCoverTiktok} width={1080} height={1920} />
      <Still id="HartaLupaCoverShorts" component={HartaLupaCoverShorts} width={1080} height={1920} />
      <Still id="HartaLupaThumbLandscape" component={HartaLupaThumbLandscape} width={1280} height={720} />
      <Still id="HartaLupaThumbVertical" component={HartaLupaThumbVertical} width={1080} height={1920} />
  </Folder>
);

export default Compositions;
