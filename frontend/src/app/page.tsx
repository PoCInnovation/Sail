import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { PartnersMarquee } from "@/components/landing/PartnersMarquee";
import { NodeNavigatorSection } from "@/components/landing/NodeNavigatorSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { NewsSection } from "@/components/landing/NewsSection";
import { NewLandingFooter } from "@/components/landing/NewLandingFooter";
import { Scanlines } from "@/components/landing/Scanlines";
import { SmoothScroll } from "@/components/landing/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative w-full overflow-x-hidden antialiased selection:bg-cyan selection:text-black">
        <Scanlines />
        <LandingNavbar />
        <LandingHero />
        <PartnersMarquee />
        <NodeNavigatorSection />
        <StatsSection />
        <NewsSection />
        <NewLandingFooter />
      </main>
    </SmoothScroll>
  );
}
