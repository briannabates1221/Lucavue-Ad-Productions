import {Menu, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {NAV_LINKS} from '../data/content';

interface HeaderProps {
  onSelectStarter: () => void;
}

export function Header({onSelectStarter}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileCtaClick = () => {
    setMobileMenuOpen(false);
    onSelectStarter();
  };

  return (
    <header className="dark-surface sticky top-0 z-40 border-b border-[#253A44] bg-[#14252D]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        {/* Zone 1: Brand wordmark + quiet descriptor */}
        <a
          href="#top"
          className="flex items-baseline gap-2.5 whitespace-nowrap shrink-0 text-[#F7F4EE] transition-opacity duration-150 hover:opacity-90"
        >
          <span className="font-display text-lg font-bold tracking-[-0.02em]">
            Lucavue
          </span>
          <span className="text-xs font-normal text-[#B8C6CE]">
            Ad Productions
          </span>
        </a>

        {/* Zone 2: Single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 text-sm font-medium text-[#D6DFE4] underline-offset-4 transition-colors duration-150 hover:text-[#F7F4EE] hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSelectStarter}
            className="hidden whitespace-nowrap shrink-0 rounded-sm bg-[#F7F4EE] px-4 py-2 text-sm font-medium text-[#14252D] transition-colors duration-150 hover:bg-white md:inline-flex"
          >
            Discuss a starter ad
          </button>

          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[#2B424D] text-[#F7F4EE] transition-colors duration-150 hover:border-[#DCA181] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Keyboard-accessible mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[#253A44] bg-[#14252D] px-5 pb-6 pt-3 md:hidden"
        >
          <ul className="flex flex-col divide-y divide-[#233741]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleMobileNavClick}
                  className="block py-3.5 text-base font-medium text-[#E5ECEF] transition-colors duration-150 hover:text-[#DCA181]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-2">
            <button
              type="button"
              onClick={handleMobileCtaClick}
              className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-[#F7F4EE] px-5 py-3 text-sm font-semibold text-[#14252D] transition-colors duration-150 hover:bg-white"
            >
              Discuss a starter ad
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
