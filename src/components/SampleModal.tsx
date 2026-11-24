import {Film, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import type {SampleAd} from '../data/content';

interface SampleModalProps {
  sample: SampleAd | null;
  onClose: () => void;
  onInquireSimilar: () => void;
}

type FormatOption = '9:16 vertical' | '4:5 feed';

export function SampleModal({
  sample,
  onClose,
  onInquireSimilar,
}: SampleModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>('9:16 vertical');
  const [imageError, setImageError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSelectedFormat('9:16 vertical');
    setImageError(false);
  }, [sample?.id]);

  useEffect(() => {
    if (!sample) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [sample, onClose]);

  if (!sample) {
    return null;
  }

  const activeVideoUrl =
    selectedFormat === '9:16 vertical'
      ? sample.verticalVideoUrl
      : sample.feedVideoUrl;

  const isVertical = selectedFormat === '9:16 vertical';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C171D]/80 p-4 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-md border border-[#DED8CF] bg-[#FFFFFF] lg:grid lg:grid-cols-12">
        {/* Left dark preview stage */}
        <div className="dark-surface flex flex-col items-center justify-between bg-[#14252D] p-5 text-[#F7F4EE] sm:p-6 lg:col-span-6">
          {/* Format switcher */}
          <div className="flex w-full items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Preview aspect ratio"
              className="inline-flex rounded-sm border border-[#2B424D] bg-[#0E1B22] p-1"
            >
              {sample.formats.map((format) => {
                const active = selectedFormat === format;
                return (
                  <button
                    key={format}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedFormat(format)}
                    className={`min-h-[36px] whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-[#F7F4EE] text-[#14252D]'
                        : 'text-[#C6D2D8] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {format}
                  </button>
                );
              })}
            </div>

            <span className="text-xs tabular-nums text-[#DCA181]">
              {sample.duration}
            </span>
          </div>

          {/* Media viewport */}
          <div className="my-5 flex w-full flex-1 items-center justify-center">
            <div
              className={`relative w-full overflow-hidden rounded-sm border border-[#2B424D] bg-[#0F1D24] ${
                isVertical
                  ? 'aspect-[9/16] max-w-[230px] sm:max-w-[250px]'
                  : 'aspect-[4/5] max-w-[280px] sm:max-w-[310px]'
              }`}
            >
              {activeVideoUrl ? (
                <video
                  key={activeVideoUrl}
                  src={activeVideoUrl}
                  poster={sample.posterImage ?? undefined}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                >
                  Your browser does not support embedded video playback.
                </video>
              ) : (
                <div className="relative h-full w-full">
                  {sample.posterImage && !imageError ? (
                    <img
                      src={sample.posterImage}
                      alt={sample.posterAlt}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#182B34] p-5 text-center">
                      <Film className="h-7 w-7 text-[#DCA181]" aria-hidden="true" />
                      <p className="mt-2.5 text-sm font-medium text-[#F7F4EE]">
                        {sample.title}
                      </p>
                      <p className="mt-1 text-xs text-[#B4C2CA]">
                        {selectedFormat} frame
                      </p>
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1920]/90 via-transparent to-[#0D1920]/30"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-3.5 text-left">
                    <p className="text-xs font-medium text-[#DCA181]">
                      Video file not yet attached
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#E3ECEF]">
                      Native playback controls will appear here automatically once
                      a {selectedFormat} video file is supplied.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="w-full text-center text-xs text-[#B4C2CA]">
            {sample.disclosure} · {sample.fictionalClientName}
          </p>
        </div>

        {/* Right details panel */}
        <div className="flex flex-col justify-between overflow-y-auto p-6 sm:p-8 lg:col-span-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#9B4D30]">
                  {sample.categoryLabel} · {sample.disclosure}
                </p>
                <h3
                  id="sample-modal-title"
                  className="mt-2 font-display text-2xl font-semibold tracking-[-0.015em] text-[#202C32]"
                >
                  {sample.title}
                </h3>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close sample preview"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#DED8CF] text-[#202C32] transition-colors duration-150 hover:border-[#9B4D30] hover:text-[#9B4D30]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#202C32]">
              {sample.conceptDescription}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-[#52616B]">
              {sample.productionNotes}
            </p>

            <div className="mt-6 border-t border-[#DED8CF] pt-5">
              <p className="text-xs font-medium text-[#52616B]">
                Production beat sheet
              </p>
              <dl className="mt-3 space-y-3">
                {sample.beats.map((beat) => (
                  <div key={beat.timing} className="text-sm">
                    <dt className="font-medium text-[#202C32]">
                      <span className="mr-2 tabular-nums text-[#9B4D30]">
                        {beat.timing}
                      </span>
                      {beat.label}
                    </dt>
                    <dd className="mt-0.5 leading-relaxed text-[#52616B]">
                      {beat.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#DED8CF] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onInquireSimilar}
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-sm bg-[#9B4D30] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#833F26]"
            >
              Discuss a $95 starter ad
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-sm border border-[#DED8CF] px-4 py-2.5 text-sm font-medium text-[#202C32] transition-colors duration-150 hover:border-[#202C32]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
