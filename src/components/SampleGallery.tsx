import {ArrowUpRight, Film} from 'lucide-react';
import {useState} from 'react';
import {
  SAMPLE_ADS,
  SAMPLE_CATEGORIES,
  type SampleAd,
  type SampleCategory,
} from '../data/content';

interface SampleGalleryProps {
  onSelectSample: (sample: SampleAd) => void;
}

interface SamplePosterProps {
  sample: SampleAd;
  aspectClass: string;
}

function SamplePoster({sample, aspectClass}: SamplePosterProps) {
  const [imageError, setImageError] = useState(false);

  if (sample.posterImage && !imageError) {
    return (
      <div className={`relative w-full overflow-hidden bg-[#14252D] ${aspectClass}`}>
        <img
          src={sample.posterImage}
          alt={sample.posterAlt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101E25]/80 via-transparent to-[#101E25]/25"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3 text-xs text-[#F7F4EE]">
          <span>
            {sample.verticalVideoUrl || sample.feedVideoUrl
              ? 'Video ready to play'
              : 'Video placeholder — asset pending'}
          </span>
          <span className="tabular-nums text-[#DCA181]">{sample.duration}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full flex-col justify-between bg-[#14252D] p-6 text-[#F7F4EE] ${aspectClass}`}
    >
      <div className="flex items-center justify-between text-xs text-[#DCA181]">
        <span>Open asset slot</span>
        <span className="tabular-nums">{sample.duration}</span>
      </div>

      <div className="my-auto py-8 text-center">
        <Film className="mx-auto h-7 w-7 text-[#DCA181]" aria-hidden="true" />
        <p className="mt-3 font-display text-base font-medium text-[#F7F4EE]">
          {sample.title}
        </p>
        <p className="mx-auto mt-2 max-w-[26ch] text-xs leading-relaxed text-[#C2CFD6]">
          Reserved for a supplied alternate-opening video cut and poster frame.
        </p>
      </div>

      <div className="border-t border-[#263C46] pt-3 text-xs text-[#B4C2CA]">
        9:16 vertical · 4:5 feed
      </div>
    </div>
  );
}

export function SampleGallery({onSelectSample}: SampleGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<SampleCategory>('all');

  const visibleSamples =
    activeCategory === 'all'
      ? SAMPLE_ADS
      : SAMPLE_ADS.filter((sample) => sample.category === activeCategory);

  const featuredSample =
    activeCategory === 'all'
      ? visibleSamples.find((sample) => sample.isPrimary) ?? null
      : null;

  const secondarySamples = featuredSample
    ? visibleSamples.filter((sample) => sample.id !== featuredSample.id)
    : visibleSamples;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-b border-[#DED8CF] bg-[#F7F4EE] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#9B4D30]">Sample work</p>
            <h2
              id="work-heading"
              className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
            >
              See the work before you send a brief.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#52616B]">
              Garage-door sample concepts illustrating our 30-second structure,
              format framing, and white-label client presentation. Final video
              cuts can be dropped directly into each slot before launch.
            </p>
          </div>

          {/* Interactive category filter bar */}
          <div
            role="group"
            aria-label="Filter sample concepts by ad type"
            className="inline-flex flex-wrap gap-1.5 rounded-sm border border-[#DED8CF] bg-[#EFEAE1] p-1 self-start lg:self-auto"
          >
            {SAMPLE_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={`min-h-[38px] whitespace-nowrap rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#202C32] shadow-[0_1px_2px_rgba(20,37,45,0.08)]'
                      : 'text-[#52616B] hover:text-[#202C32]'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured primary garage-door sample (when viewing All) */}
        {featuredSample && (
          <article className="group mt-10 overflow-hidden rounded-md border border-[#DED8CF] bg-[#FFFFFF]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SamplePoster
                  sample={featuredSample}
                  aspectClass="aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[460px]"
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#52616B]">
                    <span className="text-[#9B4D30]">{featuredSample.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredSample.disclosure}</span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.015em] text-[#202C32] sm:text-[1.75rem]">
                    {featuredSample.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#52616B]">
                    Concept brand: {featuredSample.fictionalClientName}
                  </p>

                  <p className="mt-4 text-base leading-relaxed text-[#202C32]">
                    {featuredSample.conceptDescription}
                  </p>

                  <div className="mt-6 border-t border-[#DED8CF] pt-5">
                    <p className="text-xs font-medium text-[#52616B]">
                      30-second ad structure
                    </p>
                    <dl className="mt-3 space-y-2.5">
                      {featuredSample.beats.map((beat) => (
                        <div
                          key={beat.timing}
                          className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-12 sm:gap-3"
                        >
                          <dt className="font-medium tabular-nums text-[#9B4D30] sm:col-span-3">
                            {beat.timing}
                          </dt>
                          <dd className="text-[#52616B] sm:col-span-9">
                            <span className="font-medium text-[#202C32]">
                              {beat.label}:
                            </span>{' '}
                            {beat.detail}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-[#DED8CF] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#52616B]">
                    <span>{featuredSample.formats[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredSample.formats[1]}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSample(featuredSample)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-sm bg-[#9B4D30] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#833F26]"
                  >
                    <span>
                      {featuredSample.verticalVideoUrl || featuredSample.feedVideoUrl
                        ? 'Watch sample'
                        : 'Open preview modal'}
                    </span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Secondary sample and alternate opening slot */}
        {secondarySamples.length > 0 && (
          <div
            className={`mt-6 grid grid-cols-1 gap-6 ${
              secondarySamples.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl'
            }`}
          >
            {secondarySamples.map((sample) => (
              <article
                key={sample.id}
                className="group flex flex-col overflow-hidden rounded-md border border-[#DED8CF] bg-[#FFFFFF]"
              >
                <SamplePoster sample={sample} aspectClass="aspect-[4/3]" />

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#52616B]">
                      <span className="text-[#9B4D30]">{sample.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sample.disclosure}</span>
                    </div>

                    <h3 className="mt-2.5 font-display text-xl font-semibold tracking-[-0.015em] text-[#202C32]">
                      {sample.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#52616B]">
                      {sample.conceptDescription}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#DED8CF] pt-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#52616B]">
                      <span>{sample.formats[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sample.formats[1]}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectSample(sample)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-2 text-sm font-medium text-[#202C32] transition-colors duration-150 hover:border-[#9B4D30] hover:text-[#9B4D30]"
                    >
                      <span>
                        {sample.isAssetSlot ? 'Inspect slot details' : 'Open preview modal'}
                      </span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
