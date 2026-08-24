import { HeroSection } from '@/components/landing/hero-section';
import { QuickSimulator } from '@/components/landing/quick-simulator';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { VideoShowcase } from '@/components/landing/video-showcase';
import { ComparisonSection } from '@/components/landing/comparison';
import { PricingSection } from '@/components/landing/pricing-section';
import { FaqSection } from '@/components/landing/faq-section';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <QuickSimulator />
      <FeatureGrid />
      <VideoShowcase />
      <ComparisonSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
}
