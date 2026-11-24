import {
  ABOUT_STUDIO_STANDARDS,
  INCLUDED_ITEMS,
  PRICING_TIERS,
  PROCESS_STEPS,
  WHY_LUCAVUE_BENEFITS,
  type PackageId,
} from '../data/content';

interface PricingSectionProps {
  onSelectPackage: (pkg: Exclude<PackageId, 'unsure'>) => void;
}

export function WhatsIncludedSection() {
  return (
    <section
      id="whats-included"
      aria-labelledby="included-heading"
      className="border-b border-[#DED8CF] bg-[#F7F4EE] py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-[#9B4D30]">What’s included</p>
          <h2
            id="included-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
          >
            One brief. A finished ad in two formats.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#52616B]">
            Every ad is delivered ready for your agency to review, hand off, or
            upload—with consistent client branding and defined scope.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ul className="grid grid-cols-1 border-t border-[#DED8CF] sm:grid-cols-2">
            {INCLUDED_ITEMS.map((item, index) => (
              <li
                key={item}
                className="flex items-baseline gap-3.5 border-b border-[#DED8CF] py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
              >
                <span className="text-xs font-semibold tabular-nums text-[#9B4D30]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-base font-medium text-[#202C32]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="process-heading"
      className="border-b border-[#DED8CF] bg-[#FFFFFF] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#9B4D30]">How it works</p>
          <h2
            id="process-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
          >
            Three straightforward steps from brief to delivery.
          </h2>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {PROCESS_STEPS.map((step) => (
            <li
              key={step.number}
              className="border-t border-[#DED8CF] pt-6"
            >
              <p className="font-display text-sm font-semibold tabular-nums text-[#9B4D30]">
                {step.number}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.015em] text-[#202C32]">
                {step.title}
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-[#52616B]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-md border border-[#DED8CF] bg-[#F7F4EE] px-6 py-5">
          <p className="text-sm leading-relaxed text-[#202C32]">
            Typical production target: 48–72 hours. Timing is confirmed after we
            review your brief and assets; batch schedules are agreed separately.
          </p>
        </div>
      </div>
    </section>
  );
}

export function PricingSection({onSelectPackage}: PricingSectionProps) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="border-b border-[#DED8CF] bg-[#F7F4EE] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#9B4D30]">Pricing</p>
          <h2
            id="pricing-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
          >
            Straightforward wholesale pricing.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col justify-between rounded-md border border-[#DED8CF] bg-[#FFFFFF] p-7 sm:p-8"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-[#202C32]">
                  {tier.name}
                </h3>

                <p className="mt-4 flex items-baseline gap-1 font-display text-4xl font-semibold tracking-[-0.02em] tabular-nums text-[#202C32]">
                  <span>{tier.price}</span>
                  {tier.cadence && (
                    <span className="text-base font-medium text-[#52616B]">
                      {tier.cadence}
                    </span>
                  )}
                </p>

                <p className="mt-4 text-base leading-relaxed text-[#52616B]">
                  {tier.summary}
                </p>
              </div>

              <div className="mt-8 border-t border-[#DED8CF] pt-6">
                <button
                  type="button"
                  onClick={() => onSelectPackage(tier.id)}
                  className="inline-flex min-h-[46px] w-full items-center justify-center whitespace-nowrap rounded-sm bg-[#9B4D30] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#833F26]"
                >
                  {tier.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-[#52616B]">
          Each ad includes voiceover, captions, client branding, vertical and
          feed exports, and one revision. Batch timing and production
          availability are confirmed before booking.
        </p>
      </div>
    </section>
  );
}

export function WhyLucavueSection() {
  return (
    <section
      id="why-lucavue"
      aria-labelledby="why-heading"
      className="border-b border-[#DED8CF] bg-[#FFFFFF] py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-[#9B4D30]">Why Lucavue</p>
          <h2
            id="why-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
          >
            A production partner, not another service to manage.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#52616B]">
            Built to fit quietly inside an agency’s existing delivery workflow
            without adding overhead or competing for your client account.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ul className="divide-y divide-[#DED8CF] border-y border-[#DED8CF]">
            {WHY_LUCAVUE_BENEFITS.map((benefit) => (
              <li key={benefit.title} className="py-5">
                <h3 className="font-display text-lg font-semibold text-[#202C32]">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#52616B]">
                  {benefit.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function AboutUsSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-[#DED8CF] bg-[#F7F4EE] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#9B4D30]">About Lucavue</p>
            <h2
              id="about-heading"
              className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
            >
              A small, detail-oriented studio built behind your agency.
            </h2>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-[#52616B]">
              <p>
                Lucavue Ad Productions exists with one mission: give U.S.
                marketing agencies, freelance marketers, and social media
                managers a dependable white-label studio for finished 30-second
                video ads—starting with garage-door service businesses.
              </p>
              <p>
                Agency teams shouldn’t have to choose between stretched internal
                bandwidth and unpredictable marketplaces. Our approach is calm,
                capable, and straightforward: we read every brief carefully,
                respect your client’s approved claims and brand guidelines, and
                collaborate in writing so production stays organized from first
                handoff to final export.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-md border border-[#DED8CF] bg-[#FFFFFF] p-6 sm:p-8">
              <p className="text-xs font-medium text-[#52616B]">
                How the studio works with your team
              </p>

              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                {ABOUT_STUDIO_STANDARDS.map((standard) => (
                  <div
                    key={standard.number}
                    className="border-t border-[#DED8CF] pt-4"
                  >
                    <p className="text-xs font-semibold tabular-nums text-[#9B4D30]">
                      {standard.number}
                    </p>
                    <h3 className="mt-2 font-display text-base font-semibold text-[#202C32]">
                      {standard.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#52616B]">
                      {standard.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
