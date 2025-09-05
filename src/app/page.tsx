import { ScrollArea } from "@/components/ui/scroll-area";
import WavyHero from '@/components/nextbunny/WavyHero';
import HardToResist from '@/components/nextbunny/HardToResist';
import AceNavbarDemo from '@/components/nextbunny/AceNavbarDemo';
import MiscPricing from '@/components/nextbunny/MiscPricing';
import CompellingCTA from '@/components/nextbunny/compellingCTA';
import Footer from '@/components/nextbunny/footer';

export default function Home() {
  return (
    <ScrollArea className="h-screen">
      <WavyHero />
      <HardToResist />
      <AceNavbarDemo />
      <MiscPricing />
      <CompellingCTA />
      <Footer />
    </ScrollArea>
  );
}