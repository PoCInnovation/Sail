import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-walrus-bg selection:bg-walrus-mint selection:text-walrus-bg">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}
