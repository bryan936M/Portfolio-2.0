import { BrandMark } from "@/components/ui/BrandMark";
import "@/styles/home-opening.css";

export function HomeOpening() {
  return (
    <div id="home-opening" className="home-opening" aria-hidden="true">
      <BrandMark className="home-opening-mark" />
    </div>
  );
}
