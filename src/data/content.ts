export type SampleCategory = 'all' | 'emergency-repair' | 'service-offer' | 'alternate-opening';

export type PackageId = 'starter' | 'four-pack' | 'monthly' | 'unsure';

export interface SampleBeat {
  timing: string;
  label: string;
  detail: string;
}

export interface SampleAd {
  id: string;
  title: string;
  category: Exclude<SampleCategory, 'all'>;
  categoryLabel: string;
  fictionalClientName: string;
  disclosure: string;
  conceptDescription: string;
  productionNotes: string;
  formats: readonly ['9:16 vertical', '4:5 feed'];
  duration: string;
  posterImage: string | null;
  posterAlt: string;
  /** Populate with a real MP4/WebM URL when supplied; null renders an honest pending-asset state. */
  verticalVideoUrl: string | null;
  /** Populate with a real MP4/WebM URL when supplied; null renders an honest pending-asset state. */
  feedVideoUrl: string | null;
  isPrimary: boolean;
  isAssetSlot: boolean;
  beats: SampleBeat[];
}

export interface PricingTier {
  id: Exclude<PackageId, 'unsure'>;
  name: string;
  price: string;
  cadence: string | null;
  summary: string;
  ctaLabel: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface StudioStandard {
  number: string;
  title: string;
  description: string;
}

export const NAV_LINKS = [
  {label: 'Work', href: '#work'},
  {label: 'How it works', href: '#how-it-works'},
  {label: 'Pricing', href: '#pricing'},
  {label: 'About', href: '#about'},
  {label: 'FAQ', href: '#faq'},
] as const;

export const SAMPLE_CATEGORIES: {id: SampleCategory; label: string}[] = [
  {id: 'all', label: 'All samples'},
  {id: 'emergency-repair', label: 'Emergency repair'},
  {id: 'service-offer', label: 'Service offer'},
  {id: 'alternate-opening', label: 'Alternate opening'},
];

export const SAMPLE_ADS: SampleAd[] = [
  {
    id: 'sample-emergency-repair',
    title: 'Same-day spring & track repair',
    category: 'emergency-repair',
    categoryLabel: 'Emergency repair',
    fictionalClientName: 'Alder Ridge Garage Door Co.',
    disclosure: 'Sample work – fictional brand',
    conceptDescription:
      'Direct-response 30-second ad designed for local homeowners dealing with a stuck door or snapped torsion spring. Opens on a clear problem hook, walks through a calm technician inspection, and closes on the client’s same-day service offer and branded contact end card.',
    productionNotes:
      'Includes voiceover narration, clean burned-in captions positioned inside vertical and feed safe zones, and full end-client branding with zero Lucavue watermark on paid deliverables.',
    formats: ['9:16 vertical', '4:5 feed'],
    duration: '0:30',
    posterImage: '/src/assets/images/sample_garage_repair_vertical_1795491534245.jpg',
    posterAlt:
      'Uniformed garage door technician inspecting a residential steel garage door track and hardware along a suburban driveway',
    verticalVideoUrl: null,
    feedVideoUrl: null,
    isPrimary: true,
    isAssetSlot: false,
    beats: [
      {
        timing: '0:00–0:05',
        label: 'Opening hook',
        detail: 'Immediate visual of a stalled garage door paired with a concise voiceover question and readable center-safe caption.',
      },
      {
        timing: '0:05–0:21',
        label: 'Service clarity',
        detail: 'Calm inspection footage covering broken springs, misaligned tracks, and opener diagnostics using approved client claims.',
      },
      {
        timing: '0:21–0:30',
        label: 'Client offer & end card',
        detail: 'End-client logo, service area callout, and clear booking offer framed cleanly for both 9:16 and 4:5 placements.',
      },
    ],
  },
  {
    id: 'sample-insulated-upgrade',
    title: 'Insulated carriage-door replacement',
    category: 'service-offer',
    categoryLabel: 'Service offer',
    fictionalClientName: 'Cedarline Door & Hardware',
    disclosure: 'Sample work – fictional brand',
    conceptDescription:
      'Curb-appeal and energy-efficiency concept for higher-ticket door replacement campaigns. Pairs architectural home exteriors with straightforward voiceover copy highlighting quiet operation, insulation, and free on-site estimates.',
    productionNotes:
      'Built from a single agency brief with client-supplied photos or clips, paced for silent autoplay with legible captions and a clean branded closing frame.',
    formats: ['9:16 vertical', '4:5 feed'],
    duration: '0:30',
    posterImage: '/src/assets/images/sample_garage_upgrade_poster_1795491529041.jpg',
    posterAlt:
      'Suburban home exterior featuring newly installed dark charcoal insulated carriage-style garage doors in afternoon sunlight',
    verticalVideoUrl: null,
    feedVideoUrl: null,
    isPrimary: false,
    isAssetSlot: false,
    beats: [
      {
        timing: '0:00–0:06',
        label: 'Visual contrast',
        detail: 'Establishes curb-appeal transformation with an architectural exterior frame and direct caption headline.',
      },
      {
        timing: '0:06–0:22',
        label: 'Value points',
        detail: 'Highlights quiet hardware, insulated steel panels, and professional installation without inflated promises.',
      },
      {
        timing: '0:22–0:30',
        label: 'Estimate CTA',
        detail: 'Closes on the client’s seasonal replacement offer, logo, and local service callout.',
      },
    ],
  },
  {
    id: 'sample-alternate-opening',
    title: 'Alternate 3-second opening hook',
    category: 'alternate-opening',
    categoryLabel: 'Alternate opening',
    fictionalClientName: 'Open production slot',
    disclosure: 'Sample work – fictional brand',
    conceptDescription:
      'Reserved slot for an alternate opening variation demonstrating how agencies can test a second visual or spoken hook while keeping the core 30-second body and client end card consistent.',
    productionNotes:
      'Ready to attach a supplied video file and poster once final sample cuts are exported for review.',
    formats: ['9:16 vertical', '4:5 feed'],
    duration: '0:30',
    posterImage: null,
    posterAlt: 'Placeholder slot reserved for an alternate opening garage-door video sample',
    verticalVideoUrl: null,
    feedVideoUrl: null,
    isPrimary: false,
    isAssetSlot: true,
    beats: [
      {
        timing: '0:00–0:04',
        label: 'Hook variation',
        detail: 'Tests an alternative first line and visual cut tailored to seasonal tune-ups or noisy-opener pain points.',
      },
      {
        timing: '0:04–0:22',
        label: 'Core narrative',
        detail: 'Maintains consistent voiceover cadence, readable captions, and factual service highlights.',
      },
      {
        timing: '0:22–0:30',
        label: 'Branded close',
        detail: 'Matches the client’s exact logo placement, palette, and approved offer statement.',
      },
    ],
  },
];

export const INCLUDED_ITEMS = [
  'One finished 30-second video ad',
  'Voiceover',
  'Captions',
  'End-client branding',
  '9:16 vertical master',
  '4:5 feed crop',
  'One revision',
  'No Lucavue watermark on paid deliverables',
] as const;

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Send the brief',
    description:
      'Share your client’s brand assets, offer, approved claims, and available footage or photos.',
  },
  {
    number: '02',
    title: 'We produce the ad',
    description:
      'Lucavue assembles the visuals, voiceover, captions, and client branding.',
  },
  {
    number: '03',
    title: 'Review and receive',
    description:
      'Review the ad, use the included revision if needed, and receive the final vertical and feed exports.',
  },
] as const;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Ad',
    price: '$95',
    cadence: null,
    summary: 'One finished 30-second video ad.',
    ctaLabel: 'Ask about a starter ad',
  },
  {
    id: 'four-pack',
    name: 'Four-Ad Pack',
    price: '$340',
    cadence: null,
    summary: 'Four finished 30-second video ads.',
    ctaLabel: 'Discuss a four-ad pack',
  },
  {
    id: 'monthly',
    name: 'Monthly Production',
    price: '$750',
    cadence: '/month',
    summary: 'Ten finished 30-second video ads per month.',
    ctaLabel: 'Discuss monthly production',
  },
];

export const WHY_LUCAVUE_BENEFITS = [
  {
    title: 'White-label delivery that supports your agency relationship',
    detail:
      'Every paid export carries your client’s brand identity and leaves Lucavue out of sight, so the finished creative reinforces your team’s work.',
  },
  {
    title: 'Clear, defined production scope',
    detail:
      'You know what goes into every 30-second deliverable before work begins—no ambiguous add-ons or moving specifications.',
  },
  {
    title: 'Two useful ad formats from one brief',
    detail:
      'Receive both a 9:16 vertical master and a 4:5 feed crop from a single handoff, composed cleanly for their respective placements.',
  },
  {
    title: 'Written, asynchronous communication',
    detail:
      'Send briefs, asset links, and revision notes in writing without booking recurring status calls.',
  },
  {
    title: 'A garage-door focus that keeps the creative relevant',
    detail:
      'Starting with garage-door service businesses keeps scripting, pacing, and visual framing grounded in what homeowners actually call about.',
  },
] as const;

export const ABOUT_STUDIO_STANDARDS: StudioStandard[] = [
  {
    number: '01',
    title: 'Built specifically for agency workflows',
    description:
      'We operate behind the scenes as a quiet production bench for small agencies, freelance marketers, and social media managers—never competing for your client relationship or media retainer.',
  },
  {
    number: '02',
    title: 'Calm, structured collaboration',
    description:
      'Every project starts with a direct written review of your client’s offer, approved claims, and supplied assets so questions are resolved early instead of during late-stage edits.',
  },
  {
    number: '03',
    title: 'Attention to the details clients notice',
    description:
      'We pay close attention to voiceover pacing, caption timing and safe-zone placement, accurate logo usage, and clean crop transitions between 9:16 vertical and 4:5 feed deliveries.',
  },
  {
    number: '04',
    title: 'Straightforward scope over hype',
    description:
      'We focus on producing dependable, client-ready video ads with honest turnaround targets and one structured revision round—leaving campaign strategy and media buying in your hands.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'who-is-this-for',
    question: 'Who is this for?',
    answer:
      'Small agencies, freelance marketers, and social media managers producing creative for service-business clients.',
  },
  {
    id: 'branding-in-ad',
    question: 'Will Lucavue branding appear in the ad?',
    answer:
      'Paid client deliverables do not include a Lucavue watermark; they use the end client’s branding.',
  },
  {
    id: 'what-to-send',
    question: 'What should I send?',
    answer:
      'Client brand assets, the offer, approved claims, and available footage or photos. Any missing materials are discussed before production.',
  },
  {
    id: 'campaign-management',
    question: 'Do you manage advertising campaigns?',
    answer:
      'No. The offer covers video production, not media buying, ad-account management, or marketing strategy.',
  },
  {
    id: 'formats',
    question: 'What formats do I receive?',
    answer: 'A 9:16 vertical master and a 4:5 feed crop.',
  },
  {
    id: 'turnaround',
    question: 'How quickly can I receive an ad?',
    answer:
      'The production target is 48–72 hours, with timing confirmed after reviewing the brief and assets. Multi-ad schedules are agreed separately.',
  },
  {
    id: 'revisions',
    question: 'What if I need changes?',
    answer:
      'One revision is included per ad. Any additional scope is discussed before proceeding.',
  },
];

export const PACKAGE_OPTIONS: {value: PackageId; label: string}[] = [
  {value: 'starter', label: 'Starter Ad — $95 (1 ad)'},
  {value: 'four-pack', label: 'Four-Ad Pack — $340 (4 ads)'},
  {value: 'monthly', label: 'Monthly Production — $750/month (10 ads/month)'},
  {value: 'unsure', label: 'Not sure yet — let’s discuss scope'},
];
