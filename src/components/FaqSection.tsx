import {ChevronDown} from 'lucide-react';
import {useState} from 'react';
import {FAQ_ITEMS} from '../data/content';

export function FaqSection() {
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b border-[#DED8CF] bg-[#FFFFFF] py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-[#9B4D30]">FAQ</p>
          <h2
            id="faq-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
          >
            Straight answers before you send a brief.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#52616B]">
            Clear expectations around white-label delivery, formats, timing, and
            revisions.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="divide-y divide-[#DED8CF] border-y border-[#DED8CF]">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openIds.includes(item.id);
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <div key={item.id}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="flex min-h-[56px] w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-semibold text-[#202C32] transition-colors duration-150 hover:text-[#9B4D30] sm:text-lg"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 shrink-0 text-[#52616B] transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-[#9B4D30]' : ''
                        }`}
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="pb-5 pr-8"
                  >
                    <p className="text-base leading-relaxed text-[#52616B]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
