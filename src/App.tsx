import {useState} from 'react';
import {FaqSection} from './components/FaqSection';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {Hero} from './components/Hero';
import {InquirySection} from './components/InquirySection';
import {SampleGallery} from './components/SampleGallery';
import {SampleModal} from './components/SampleModal';
import {
  AboutUsSection,
  HowItWorksSection,
  PricingSection,
  WhatsIncludedSection,
  WhyLucavueSection,
} from './components/StudioSections';
import {SAMPLE_ADS, type PackageId, type SampleAd} from './data/content';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<PackageId>('starter');
  const [activeSample, setActiveSample] = useState<SampleAd | null>(null);

  const primarySample = SAMPLE_ADS[0];

  const jumpToInquiry = (pkg: PackageId) => {
    setSelectedPackage(pkg);
    const target = document.getElementById('inquire');
    if (target) {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const handleInquireFromModal = () => {
    setActiveSample(null);
    jumpToInquiry('starter');
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F7F4EE] text-[#202C32]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-[#F7F4EE] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#14252D]"
      >
        Skip to main content
      </a>

      <Header onSelectStarter={() => jumpToInquiry('starter')} />

      <main id="main-content">
        <Hero
          primarySample={primarySample}
          onInquireStarter={() => jumpToInquiry('starter')}
          onInspectSample={(sample) => setActiveSample(sample)}
        />

        <SampleGallery onSelectSample={(sample) => setActiveSample(sample)} />

        <WhatsIncludedSection />

        <HowItWorksSection />

        <PricingSection onSelectPackage={(pkg) => jumpToInquiry(pkg)} />

        <WhyLucavueSection />

        <AboutUsSection />

        <FaqSection />

        <InquirySection
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
        />
      </main>

      <Footer />

      <SampleModal
        sample={activeSample}
        onClose={() => setActiveSample(null)}
        onInquireSimilar={handleInquireFromModal}
      />
    </div>
  );
}
