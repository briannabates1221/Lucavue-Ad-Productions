import {NAV_LINKS} from '../data/content';

export function Footer() {
  return (
    <footer className="dark-surface border-t border-[#253A44] bg-[#14252D] text-[#F7F4EE]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-base font-semibold tracking-[-0.01em] text-[#F7F4EE]">
            Lucavue Ad Productions
          </p>
          <p className="mt-1 text-sm text-[#B8C6CE]">
            White-label video ads for agencies.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-[#D6DFE4] underline-offset-4 transition-colors duration-150 hover:text-[#F7F4EE] hover:underline"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inquire"
            className="whitespace-nowrap text-sm text-[#DCA181] underline-offset-4 transition-colors duration-150 hover:text-[#F7F4EE] hover:underline"
          >
            Inquire
          </a>
        </nav>
      </div>
    </footer>
  );
}
