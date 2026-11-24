import {ArrowUpRight, Film} from 'lucide-react';
import {useState} from 'react';
import type {SampleAd} from '../data/content';

interface HeroProps {
  primarySample: SampleAd;
  onInquireStarter: () => void;
  onInspectSample: (sample: SampleAd) => void;
}

export function Hero({primarySample, onInquireStarter, onInspectSample}: HeroProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section
      id="top"
      className="dark-surface border-b border-[#253A44] bg-[#14252D] text-[#F7F4EE]"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
        {/* Left column: Clear editorial positioning */}
        <div className="lg:col-span-7">
          <p className="text-sm font-medium tracking-[0.01em] text-[#DCA181]">
            White-label video production for agencies
          </p>

          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.125rem,3.8vw,3.35rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-[#F7F4EE]">
            Your clients’ brands. Your agency’s name. Our video production.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#D4DFE5] sm:text-lg sm:leading-[1.65]">
            Finished 30-second video ads with voiceover, captions, and client
            branding—delivered in vertical and feed formats. Starting with
            garage-door services.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={onInquireStarter}
              className="inline-flex min-h-[46px] items-center justify-center whitespace-nowrap rounded-sm bg-[#F7F4EE] px-6 py-3 text-sm font-semibold text-[#14252D] transition-colors duration-150 hover:bg-white"
            >
              Discuss a $95 starter ad
            </button>

            <a
              href="#work"
              className="inline-flex min-h-[46px] items-center justify-center whitespace-nowrap rounded-sm border border-[#3E5763] px-6 py-3 text-sm font-medium text-[#F7F4EE] transition-colors duration-150 hover:border-[#DCA181] hover:bg-[#1B303A]"
            >
              See sample work
            </a>
          </div>

          <p className="mt-6 text-sm text-[#B4C2CA]">
            No Lucavue watermark on paid client deliverables.
          </p>
        </div>

        {/* Right column: Prominent 9:16 vertical video preview frame */}
        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <figure className="w-full max-w-[330px] overflow-hidden rounded-md border border-[#2B424D] bg-[#0F1D24]">
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#1A2D36]">
              {primarySample.posterImage && !imageFailed ? (
                <img
                  src={primarySample.posterImage}
                  alt={primarySample.posterAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#182B34] p-6 text-center">
                  <Film className="h-8 w-8 text-[#DCA181]" aria-hidden="true" />
                  <p className="mt-3 font-display text-base font-medium text-[#F7F4EE]">
                    {primarySample.title}
                  </p>
                  <p className="mt-1 text-xs text-[#B4C2CA]">
                    9:16 vertical garage-door preview
                  </p>
                </div>
              )}

              {/* Measured scrim ensuring >= 4.5:1 text legibility over still */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1920]/95 via-[#0D1920]/35 to-[#0D1920]/25"
              />

              {/* Top honest status label */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-4 py-3.5 text-xs text-[#E7EEF1]">
                <span className="font-medium">
                  {primarySample.verticalVideoUrl ? '30s video sample' : 'Video preview placeholder'}
                </span>
                <span className="tabular-nums text-[#DCA181]">
                  9:16 · {primarySample.duration}
                </span>
              </div>

              {/* Bottom caption & honest action */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs text-[#DCA181]">
                  {primarySample.disclosure}
                </p>
                <p className="mt-1 font-display text-base font-semibold leading-snug text-[#F7F4EE]">
                  {primarySample.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#CBD6DC]">
                  {primarySample.verticalVideoUrl
                    ? 'Ready to play with voiceover and captions.'
                    : 'Still frame shown while final video cut is being prepared.'}
                </p>

                <button
                  type="button"
                  onClick={() => onInspectSample(primarySample)}
                  className="mt-3.5 inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-sm border border-[#445F6C] bg-[#14252D]/90 px-4 py-2 text-xs font-medium text-[#F7F4EE] transition-colors duration-150 hover:border-[#DCA181] hover:bg-[#1B303A]"
                >
                  <span>
                    {primarySample.verticalVideoUrl ? 'Play sample preview' : 'Inspect sample details'}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
