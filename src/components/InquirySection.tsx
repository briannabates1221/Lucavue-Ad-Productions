import {AlertCircle, CheckCircle2, ExternalLink} from 'lucide-react';
import {type FormEvent, useEffect, useRef, useState} from 'react';
import {PACKAGE_OPTIONS, type PackageId} from '../data/content';
import {buildEmbeddedFormUrl} from '../lib/googleFormsApi';
import {
  GoogleFormsWorkspace,
  type ConnectedGoogleForm,
} from './GoogleFormsWorkspace';

interface InquirySectionProps {
  selectedPackage: PackageId;
  onPackageChange: (pkg: PackageId) => void;
}

type FormStatus = 'idle' | 'submitting' | 'submitted' | 'error' | 'unconfigured';
type InquiryTab = 'direct' | 'google-forms';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InquirySection({
  selectedPackage,
  onPackageChange,
}: InquirySectionProps) {
  const inquiryEndpoint =
    (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined)?.trim() ?? '';
  const hasEndpoint = inquiryEndpoint.length > 0;

  const [activeTab, setActiveTab] = useState<InquiryTab>('direct');
  const [connectedForm, setConnectedForm] = useState<ConnectedGoogleForm | null>(
    null,
  );
  const [showDirectFallback, setShowDirectFallback] = useState(false);

  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [clientIndustry, setClientIndustry] = useState('Garage-door services');
  const [packageInterest, setPackageInterest] = useState<PackageId>(selectedPackage);
  const [projectBrief, setProjectBrief] = useState('');

  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorDetail, setErrorDetail] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPackageInterest(selectedPackage);
  }, [selectedPackage]);

  const handlePackageSelect = (nextPackage: PackageId) => {
    setPackageInterest(nextPackage);
    onPackageChange(nextPackage);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError('');
    setErrorDetail('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter an email address so we can reply in writing.');
      emailInputRef.current?.focus();
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    if (!hasEndpoint) {
      setStatus('unconfigured');
      return;
    }

    setStatus('submitting');

    const selectedOption = PACKAGE_OPTIONS.find(
      (option) => option.value === packageInterest,
    );

    try {
      const response = await fetch(inquiryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          agencyName: agencyName.trim(),
          email: trimmedEmail,
          clientIndustry: clientIndustry.trim(),
          packageInterest: selectedOption?.label ?? packageInterest,
          projectBrief: projectBrief.trim(),
        }),
      });

      if (!response.ok) {
        setStatus('error');
        setErrorDetail(
          `The configured form endpoint returned status ${response.status}. Please verify your endpoint settings and try again.`,
        );
        return;
      }

      setStatus('submitted');
      setName('');
      setAgencyName('');
      setEmail('');
      setClientIndustry('Garage-door services');
      setProjectBrief('');
    } catch {
      setStatus('error');
      setErrorDetail(
        'Could not reach the configured inquiry endpoint. Please check the network connection or endpoint configuration and try again.',
      );
    }
  };

  return (
    <section
      id="inquire"
      aria-labelledby="inquire-heading"
      className="bg-[#F7F4EE] py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        {/* Left editorial column */}
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-[#9B4D30]">Start an inquiry</p>
          <h2
            id="inquire-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-[#202C32] sm:text-4xl"
          >
            Have a garage-door client who needs video creative?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#52616B]">
            Tell us what you’re working on. Start with one ad before committing
            to a larger package.
          </p>

          <div className="mt-8 border-t border-[#DED8CF] pt-6">
            <p className="text-sm font-medium text-[#202C32]">
              Helpful notes to include in your brief
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#52616B]">
              <li>The service offer or seasonal promotion you want to highlight.</li>
              <li>Whether your client already has photos, clips, or logo files ready.</li>
              <li>Any timing needs if you are planning a multi-ad batch.</li>
            </ul>
          </div>
        </div>

        {/* Right inquiry & Google Forms card */}
        <div className="lg:col-span-7">
          <div className="rounded-md border border-[#DED8CF] bg-[#FFFFFF] p-6 sm:p-8">
            {/* Switch between public inquiry form and Google Forms workspace */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#DED8CF] pb-4">
              <div
                role="group"
                aria-label="Inquiry mode"
                className="inline-flex rounded-sm border border-[#DED8CF] bg-[#EFEAE1] p-1"
              >
                <button
                  type="button"
                  aria-pressed={activeTab === 'direct'}
                  onClick={() => setActiveTab('direct')}
                  className={`min-h-[38px] whitespace-nowrap rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    activeTab === 'direct'
                      ? 'bg-[#FFFFFF] text-[#202C32] shadow-[0_1px_2px_rgba(20,37,45,0.08)]'
                      : 'text-[#52616B] hover:text-[#202C32]'
                  }`}
                >
                  Agency inquiry
                </button>
                <button
                  type="button"
                  aria-pressed={activeTab === 'google-forms'}
                  onClick={() => setActiveTab('google-forms')}
                  className={`min-h-[38px] whitespace-nowrap rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    activeTab === 'google-forms'
                      ? 'bg-[#FFFFFF] text-[#202C32] shadow-[0_1px_2px_rgba(20,37,45,0.08)]'
                      : 'text-[#52616B] hover:text-[#202C32]'
                  }`}
                >
                  Google Forms
                </button>
              </div>

              {connectedForm && (
                <p className="text-xs text-[#52616B]">
                  Connected:{' '}
                  <span className="font-medium text-[#202C32]">
                    {connectedForm.title}
                  </span>
                </p>
              )}
            </div>

            {activeTab === 'google-forms' ? (
              <GoogleFormsWorkspace
                connectedForm={connectedForm}
                onConnectForm={(nextForm) => {
                  setConnectedForm(nextForm);
                  setShowDirectFallback(false);
                }}
                onSwitchToInquiryTab={() => setActiveTab('direct')}
              />
            ) : connectedForm && !showDirectFallback ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-[#202C32]">
                      {connectedForm.title}
                    </p>
                    <p className="text-xs text-[#52616B]">
                      Submissions go directly to your connected Google Form.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={connectedForm.responderUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-[#202C32] transition-colors duration-150 hover:border-[#9B4D30] hover:text-[#9B4D30]"
                    >
                      <span>Open in new tab</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowDirectFallback(true)}
                      className="min-h-[36px] whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium text-[#52616B] hover:text-[#202C32]"
                    >
                      View brief fields
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-sm border border-[#DED8CF] bg-[#FFFFFF]">
                  <iframe
                    title={connectedForm.title}
                    src={buildEmbeddedFormUrl(connectedForm.responderUri)}
                    className="h-[640px] w-full border-0"
                    loading="lazy"
                  >
                    Loading Google Form…
                  </iframe>
                </div>
              </div>
            ) : (
              <>
                {connectedForm && showDirectFallback && (
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-3 text-xs text-[#52616B]">
                    <span>
                      A Google Form ({connectedForm.title}) is currently connected.
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDirectFallback(false)}
                      className="font-medium text-[#9B4D30] hover:underline"
                    >
                      Return to embedded Google Form
                    </button>
                  </div>
                )}

                {!hasEndpoint && (
                  <div
                    role="note"
                    className="mb-6 flex items-start gap-3 rounded-sm border border-[#DED8CF] bg-[#F7F4EE] p-4 text-sm text-[#202C32]"
                  >
                    <AlertCircle
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#9B4D30]"
                    />
                    <div>
                      <p className="font-medium text-[#202C32]">
                        Connect Google Forms or configure an endpoint
                      </p>
                      <p className="mt-1 leading-relaxed text-[#52616B]">
                        Switch to the{' '}
                        <button
                          type="button"
                          onClick={() => setActiveTab('google-forms')}
                          className="font-medium text-[#9B4D30] underline underline-offset-2"
                        >
                          Google Forms
                        </button>{' '}
                        tab to connect a live Google Form, or set{' '}
                        <code className="font-mono text-xs text-[#202C32]">
                          VITE_INQUIRY_ENDPOINT
                        </code>{' '}
                        for direct submissions. No submission is simulated.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="inquiry-name"
                    className="block text-sm font-medium text-[#202C32]"
                  >
                    Name
                  </label>
                  <input
                    id="inquiry-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Jordan Lee"
                    className="mt-1.5 block min-h-[44px] w-full rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#202C32] placeholder:text-[#7A8790] transition-colors duration-150 focus:border-[#9B4D30] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiry-agency"
                    className="block text-sm font-medium text-[#202C32]"
                  >
                    Agency or business name
                  </label>
                  <input
                    id="inquiry-agency"
                    name="agencyName"
                    type="text"
                    autoComplete="organization"
                    value={agencyName}
                    onChange={(event) => setAgencyName(event.target.value)}
                    placeholder="Northside Digital"
                    className="mt-1.5 block min-h-[44px] w-full rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#202C32] placeholder:text-[#7A8790] transition-colors duration-150 focus:border-[#9B4D30] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="inquiry-email"
                    className="block text-sm font-medium text-[#202C32]"
                  >
                    Email <span className="text-[#9B4D30]">(required)</span>
                  </label>
                  <input
                    ref={emailInputRef}
                    id="inquiry-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'inquiry-email-error' : undefined}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) {
                        setEmailError('');
                      }
                    }}
                    placeholder="you@youragency.com"
                    className={`mt-1.5 block min-h-[44px] w-full rounded-sm border bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#202C32] placeholder:text-[#7A8790] transition-colors duration-150 focus:outline-none ${
                      emailError
                        ? 'border-[#9B4D30]'
                        : 'border-[#DED8CF] focus:border-[#9B4D30]'
                    }`}
                  />
                  {emailError && (
                    <p
                      id="inquiry-email-error"
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-[#9B4D30]"
                    >
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="inquiry-industry"
                    className="block text-sm font-medium text-[#202C32]"
                  >
                    Client industry
                  </label>
                  <input
                    id="inquiry-industry"
                    name="clientIndustry"
                    type="text"
                    value={clientIndustry}
                    onChange={(event) => setClientIndustry(event.target.value)}
                    placeholder="Garage-door services"
                    className="mt-1.5 block min-h-[44px] w-full rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#202C32] placeholder:text-[#7A8790] transition-colors duration-150 focus:border-[#9B4D30] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="inquiry-package"
                  className="block text-sm font-medium text-[#202C32]"
                >
                  Package of interest
                </label>
                <select
                  id="inquiry-package"
                  name="packageInterest"
                  value={packageInterest}
                  onChange={(event) =>
                    handlePackageSelect(event.target.value as PackageId)
                  }
                  className="mt-1.5 block min-h-[44px] w-full rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#202C32] transition-colors duration-150 focus:border-[#9B4D30] focus:outline-none"
                >
                  {PACKAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="inquiry-brief"
                  className="block text-sm font-medium text-[#202C32]"
                >
                  Short project brief
                </label>
                <textarea
                  id="inquiry-brief"
                  name="projectBrief"
                  rows={4}
                  value={projectBrief}
                  onChange={(event) => setProjectBrief(event.target.value)}
                  placeholder="Share the client’s offer, any available photos or footage, and your rough timeline."
                  className="mt-1.5 block w-full rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3.5 py-2.5 text-sm leading-relaxed text-[#202C32] placeholder:text-[#7A8790] transition-colors duration-150 focus:border-[#9B4D30] focus:outline-none"
                />
              </div>

              {/* Explicit feedback states */}
              <div aria-live="polite">
                {status === 'unconfigured' && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-sm border border-[#9B4D30]/40 bg-[#F7F4EE] p-4 text-sm text-[#202C32]"
                  >
                    <AlertCircle
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#9B4D30]"
                    />
                    <p className="leading-relaxed">
                      <span className="font-medium">Not sent — endpoint required.</span>{' '}
                      Your fields are valid, but this draft does not have a live
                      submission endpoint configured yet. Connect{' '}
                      <code className="font-mono text-xs">VITE_INQUIRY_ENDPOINT</code>{' '}
                      before publishing so agency inquiries are actually delivered.
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-sm border border-[#9B4D30] bg-[#FBF4F1] p-4 text-sm text-[#202C32]"
                  >
                    <AlertCircle
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#9B4D30]"
                    />
                    <p className="leading-relaxed">{errorDetail}</p>
                  </div>
                )}

                {status === 'submitted' && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-sm border border-[#2B424D]/30 bg-[#F2F6F7] p-4 text-sm text-[#202C32]"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#14252D]"
                    />
                    <p className="leading-relaxed">
                      <span className="font-medium">Inquiry received.</span>{' '}
                      Thank you—your brief has been delivered to our configured
                      endpoint and we will follow up in writing.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex min-h-[46px] w-full items-center justify-center whitespace-nowrap rounded-sm bg-[#9B4D30] px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#833F26] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
                >
                  {status === 'submitting' ? 'Sending inquiry…' : 'Send inquiry'}
                </button>
              </div>
            </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
