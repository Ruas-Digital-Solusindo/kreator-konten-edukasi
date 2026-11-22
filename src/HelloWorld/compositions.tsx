import { Composition, Folder } from "remotion";
import { HelloWorld } from "../HelloWorld";
import { Logo } from "./Logo";
import { Title } from "./Title";

/** Composition & still milik video ini. Ditemukan otomatis oleh src/Root.tsx. */
const Compositions: React.FC = () => (
  <Folder name="HelloWorld">
      <Composition id="Logo" component={Logo} durationInFrames={150} fps={30} width={1920} height={1080} defaultProps={{ logoColor1: "#91EAE4", logoColor2: "#86A8E7" }} />
      <Composition id="Title" component={Title} durationInFrames={115} fps={30} width={1920} height={1080} defaultProps={{ titleText: "Welcome to Remotion", titleColor: "#000000" }} />
      <Composition id="HelloWorld" component={HelloWorld} durationInFrames={150} fps={30} width={1920} height={1080} defaultProps={{ titleText: "Welcome to Remotion", titleColor: "#000000" }} />
  </Folder>
);

export default Compositions;
