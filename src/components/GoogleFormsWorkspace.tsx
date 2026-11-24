import type {User} from 'firebase/auth';
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  FilePlus2,
  LogOut,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {type FormEvent, useCallback, useEffect, useState} from 'react';
import {
  clearAccessToken,
  getAccessToken,
  googleSignIn,
  initAuth,
  logout,
} from '../lib/googleAuth';
import {
  appendFormQuestion,
  createLucavueInquiryForm,
  getGoogleForm,
  getGoogleFormResponses,
  GoogleApiAuthError,
  listGoogleForms,
  type DriveFormSummary,
  type GoogleFormDetails,
  type GoogleFormResponseRecord,
} from '../lib/googleFormsApi';
import {GoogleSignInButton} from './GoogleSignInButton';

export interface ConnectedGoogleForm {
  formId: string;
  title: string;
  responderUri: string;
}

interface GoogleFormsWorkspaceProps {
  connectedForm: ConnectedGoogleForm | null;
  onConnectForm: (form: ConnectedGoogleForm | null) => void;
  onSwitchToInquiryTab: () => void;
}

type PendingMutation =
  | {
      type: 'create-form';
      title: string;
    }
  | {
      type: 'add-question';
      formId: string;
      formTitle: string;
      questionTitle: string;
      paragraph: boolean;
      required: boolean;
      insertIndex: number;
    };

function formatDate(isoString?: string): string {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(isoString?: string): string {
  if (!isoString) {
    return 'Timestamp unavailable';
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function GoogleFormsWorkspace({
  connectedForm,
  onConnectForm,
  onSwitchToInquiryTab,
}: GoogleFormsWorkspaceProps) {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [formsList, setFormsList] = useState<DriveFormSummary[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [manualFormId, setManualFormId] = useState('');

  const [activeForm, setActiveForm] = useState<GoogleFormDetails | null>(null);
  const [responses, setResponses] = useState<GoogleFormResponseRecord[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailTab, setDetailTab] = useState<'questions' | 'responses'>('questions');

  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionParagraph, setNewQuestionParagraph] = useState(false);
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);

  const [pendingMutation, setPendingMutation] = useState<PendingMutation | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleApiError = useCallback((err: unknown) => {
    if (err instanceof GoogleApiAuthError) {
      clearAccessToken();
      setNeedsAuth(true);
      setErrorMessage(err.message);
      return;
    }

    const message =
      err instanceof Error
        ? err.message
        : 'An unexpected Google Forms API error occurred.';
    setErrorMessage(message);
  }, []);

  const loadFormsFromDrive = useCallback(
    async (tokenOverride?: string) => {
      const token = tokenOverride ?? getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }

      setIsLoadingForms(true);
      setErrorMessage('');
      try {
        const files = await listGoogleForms(token);
        setFormsList(files);
      } catch (err) {
        handleApiError(err);
      } finally {
        setIsLoadingForms(false);
      }
    },
    [handleApiError],
  );

  const loadFormDetails = useCallback(
    async (formId: string, tokenOverride?: string) => {
      const cleanedId = formId.trim();
      if (!cleanedId) {
        return;
      }

      const token = tokenOverride ?? getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }

      setSelectedFormId(cleanedId);
      setIsLoadingDetails(true);
      setErrorMessage('');
      setStatusMessage('');

      try {
        const [details, formResponses] = await Promise.all([
          getGoogleForm(token, cleanedId),
          getGoogleFormResponses(token, cleanedId),
        ]);
        setActiveForm(details);
        setResponses(formResponses);
      } catch (err) {
        handleApiError(err);
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [handleApiError],
  );

  useEffect(() => {
    const unsubscribe = initAuth(
      (signedInUser, token) => {
        setUser(signedInUser);
        setNeedsAuth(false);
        void loadFormsFromDrive(token);
      },
      () => {
        setNeedsAuth(true);
      },
    );

    return () => unsubscribe();
  }, [loadFormsFromDrive]);

  useEffect(() => {
    if (!pendingMutation) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isMutating) {
        setPendingMutation(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingMutation, isMutating]);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const result = await googleSignIn();
      setUser(result.user);
      setNeedsAuth(false);
      await loadFormsFromDrive(result.accessToken);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign-in could not be completed.';
      setErrorMessage(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setFormsList([]);
    setActiveForm(null);
    setResponses([]);
    setSelectedFormId('');
    setStatusMessage('');
    setErrorMessage('');
  };

  const handleManualOpen = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!manualFormId.trim()) {
      return;
    }
    void loadFormDetails(manualFormId);
  };

  const requestCreateLucavueForm = () => {
    setErrorMessage('');
    setStatusMessage('');
    setPendingMutation({
      type: 'create-form',
      title: 'Lucavue Ad Productions — Agency Inquiry Brief',
    });
  };

  const requestAddQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeForm || !newQuestionTitle.trim()) {
      return;
    }

    setErrorMessage('');
    setStatusMessage('');
    setPendingMutation({
      type: 'add-question',
      formId: activeForm.formId,
      formTitle: activeForm.info?.title || 'Selected Google Form',
      questionTitle: newQuestionTitle.trim(),
      paragraph: newQuestionParagraph,
      required: newQuestionRequired,
      insertIndex: activeForm.items?.length ?? 0,
    });
  };

  const executeConfirmedMutation = async () => {
    if (!pendingMutation) {
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setPendingMutation(null);
      setNeedsAuth(true);
      return;
    }

    setIsMutating(true);
    setErrorMessage('');

    try {
      if (pendingMutation.type === 'create-form') {
        const created = await createLucavueInquiryForm(token, pendingMutation.title);
        setActiveForm(created);
        setSelectedFormId(created.formId);
        setResponses([]);
        setDetailTab('questions');
        setStatusMessage(
          `Created "${created.info?.title ?? pendingMutation.title}" in your Google Drive with all six Lucavue inquiry fields.`,
        );
        if (created.responderUri) {
          onConnectForm({
            formId: created.formId,
            title: created.info?.title ?? pendingMutation.title,
            responderUri: created.responderUri,
          });
        }
        await loadFormsFromDrive(token);
      } else if (pendingMutation.type === 'add-question') {
        const updated = await appendFormQuestion(token, pendingMutation.formId, {
          title: pendingMutation.questionTitle,
          paragraph: pendingMutation.paragraph,
          required: pendingMutation.required,
          insertIndex: pendingMutation.insertIndex,
        });
        setActiveForm(updated);
        setNewQuestionTitle('');
        setNewQuestionParagraph(false);
        setNewQuestionRequired(false);
        setStatusMessage(
          `Added "${pendingMutation.questionTitle}" to "${pendingMutation.formTitle}".`,
        );
      }
      setPendingMutation(null);
    } catch (err) {
      setPendingMutation(null);
      handleApiError(err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleCopyResponderLink = async (uri: string) => {
    try {
      await navigator.clipboard.writeText(uri);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setErrorMessage('Could not copy link automatically. You can copy it from Google Forms.');
    }
  };

  const questionTitleById = new Map<string, string>();
  activeForm?.items?.forEach((item) => {
    const qId = item.questionItem?.question?.questionId;
    if (qId) {
      questionTitleById.set(qId, item.title || 'Untitled question');
    }
  });

  if (needsAuth) {
    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-[#202C32]">
            Connect Google Forms for studio briefs
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#52616B]">
            Sign in with your Google Workspace account to create a pre-built
            Lucavue Agency Inquiry Form in Google Drive, select an existing form
            to embed for visitors, and review incoming agency responses here.
          </p>
        </div>

        <ul className="space-y-1.5 border-y border-[#DED8CF] py-4 text-sm text-[#52616B]">
          <li>Create the six-field Lucavue brief form directly in Google Drive.</li>
          <li>Attach any Google Form to the inquiry tab for live agency submissions.</li>
          <li>Inspect form questions and read submitted agency responses in one view.</li>
        </ul>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-sm border border-[#9B4D30] bg-[#FBF4F1] p-3.5 text-sm text-[#202C32]"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#9B4D30]"
            />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        <div>
          <GoogleSignInButton onClick={handleSignIn} loading={isLoggingIn} />
        </div>
      </div>
    );
  }

  const isActiveFormConnected =
    Boolean(activeForm?.formId) && connectedForm?.formId === activeForm?.formId;

  return (
    <div className="space-y-6">
      {/* Account header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DED8CF] pb-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#9B4D30]">
            Google Workspace connected
          </p>
          <p className="truncate text-sm font-medium text-[#202C32]">
            {user?.displayName ? `${user.displayName} · ` : ''}
            {user?.email ?? 'Signed-in Google account'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-3 py-1.5 text-xs font-medium text-[#202C32] transition-colors duration-150 hover:border-[#202C32]"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>

      {/* Feedback banners */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-[#9B4D30] bg-[#FBF4F1] p-3.5 text-sm text-[#202C32]"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#9B4D30]"
          />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {statusMessage && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-sm border border-[#2B424D]/30 bg-[#F2F6F7] p-3.5 text-sm text-[#202C32]"
        >
          <Check
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#14252D]"
          />
          <p className="leading-relaxed">{statusMessage}</p>
        </div>
      )}

      {/* Primary actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={requestCreateLucavueForm}
          className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-sm bg-[#9B4D30] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#833F26]"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          <span>Create Lucavue inquiry form</span>
        </button>

        <button
          type="button"
          onClick={() => void loadFormsFromDrive()}
          disabled={isLoadingForms}
          className="inline-flex min-h-[42px] items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3.5 py-2 text-sm font-medium text-[#202C32] transition-colors duration-150 hover:border-[#9B4D30] hover:text-[#9B4D30] disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoadingForms ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <span>{isLoadingForms ? 'Loading forms…' : 'Refresh Drive forms'}</span>
        </button>
      </div>

      {/* Forms list from Google Drive */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-medium text-[#52616B]">
            Your Google Forms ({formsList.length})
          </p>
        </div>

        {isLoadingForms && formsList.length === 0 ? (
          <p className="rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-4 text-sm text-[#52616B]">
            Loading Google Forms from your Drive…
          </p>
        ) : formsList.length === 0 ? (
          <p className="rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-4 text-sm text-[#52616B]">
            No Google Forms found in your Drive yet. Use “Create Lucavue inquiry
            form” above to generate one with your agency brief fields.
          </p>
        ) : (
          <ul className="max-h-52 divide-y divide-[#DED8CF] overflow-y-auto rounded-sm border border-[#DED8CF]">
            {formsList.map((file) => {
              const isSelected = file.id === selectedFormId;
              const isConnected = connectedForm?.formId === file.id;
              return (
                <li key={file.id}>
                  <button
                    type="button"
                    onClick={() => void loadFormDetails(file.id)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                      isSelected
                        ? 'bg-[#F7F4EE] text-[#202C32]'
                        : 'bg-[#FFFFFF] text-[#202C32] hover:bg-[#FAF8F4]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#202C32]">
                        {file.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#52616B]">
                        {file.modifiedTime
                          ? `Updated ${formatDate(file.modifiedTime)}`
                          : 'Google Form'}
                        {isConnected ? ' · Active on inquiry tab' : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-[#9B4D30]">
                      {isSelected ? 'Viewing' : 'Inspect'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Direct Form ID lookup */}
        <form onSubmit={handleManualOpen} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="google-form-id-input" className="sr-only">
            Open Google Form by ID
          </label>
          <input
            id="google-form-id-input"
            type="text"
            value={manualFormId}
            onChange={(event) => setManualFormId(event.target.value)}
            placeholder="Or paste a Google Form ID to load directly"
            className="min-h-[40px] flex-1 rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3 py-2 text-xs text-[#202C32] placeholder:text-[#7A8790] focus:border-[#9B4D30] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!manualFormId.trim() || isLoadingDetails}
            className="min-h-[40px] whitespace-nowrap rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-2 text-xs font-medium text-[#202C32] transition-colors duration-150 hover:border-[#9B4D30] hover:text-[#9B4D30] disabled:opacity-50"
          >
            Load form
          </button>
        </form>
      </div>

      {/* Selected Form inspector */}
      {isLoadingDetails && (
        <p className="rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-5 text-sm text-[#52616B]">
          Loading Google Form structure and responses…
        </p>
      )}

      {activeForm && !isLoadingDetails && (
        <div className="space-y-5 border-t border-[#DED8CF] pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#9B4D30]">Selected form</p>
              <h4 className="mt-1 font-display text-lg font-semibold text-[#202C32]">
                {activeForm.info?.title || 'Untitled Google Form'}
              </h4>
              {activeForm.info?.description && (
                <p className="mt-1 text-xs leading-relaxed text-[#52616B]">
                  {activeForm.info.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {activeForm.responderUri && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (isActiveFormConnected) {
                        onConnectForm(null);
                      } else if (activeForm.responderUri) {
                        onConnectForm({
                          formId: activeForm.formId,
                          title: activeForm.info?.title || 'Google Form',
                          responderUri: activeForm.responderUri,
                        });
                        onSwitchToInquiryTab();
                      }
                    }}
                    className={`min-h-[38px] whitespace-nowrap rounded-sm px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                      isActiveFormConnected
                        ? 'border border-[#DED8CF] bg-[#F7F4EE] text-[#202C32] hover:border-[#9B4D30]'
                        : 'bg-[#14252D] text-[#F7F4EE] hover:bg-[#1E3642]'
                    }`}
                  >
                    {isActiveFormConnected
                      ? 'Disconnect from inquiry tab'
                      : 'Use on inquiry tab'}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleCopyResponderLink(activeForm.responderUri!)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-[#202C32] transition-colors duration-150 hover:border-[#9B4D30] hover:text-[#9B4D30]"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={activeForm.responderUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-[#202C32] transition-colors duration-150 hover:border-[#9B4D30] hover:text-[#9B4D30]"
                  >
                    <span>Open form</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Sub-tabs: Questions vs Responses */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Form inspector view"
              className="inline-flex rounded-sm border border-[#DED8CF] bg-[#EFEAE1] p-1"
            >
              <button
                type="button"
                aria-pressed={detailTab === 'questions'}
                onClick={() => setDetailTab('questions')}
                className={`min-h-[34px] whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                  detailTab === 'questions'
                    ? 'bg-[#FFFFFF] text-[#202C32]'
                    : 'text-[#52616B] hover:text-[#202C32]'
                }`}
              >
                Questions ({activeForm.items?.length ?? 0})
              </button>
              <button
                type="button"
                aria-pressed={detailTab === 'responses'}
                onClick={() => setDetailTab('responses')}
                className={`min-h-[34px] whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                  detailTab === 'responses'
                    ? 'bg-[#FFFFFF] text-[#202C32]'
                    : 'text-[#52616B] hover:text-[#202C32]'
                }`}
              >
                Responses ({responses.length})
              </button>
            </div>

            {detailTab === 'responses' && (
              <button
                type="button"
                onClick={() => void loadFormDetails(activeForm.formId)}
                className="inline-flex min-h-[34px] items-center gap-1.5 text-xs font-medium text-[#9B4D30] hover:underline"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Refresh responses</span>
              </button>
            )}
          </div>

          {/* Questions panel */}
          {detailTab === 'questions' && (
            <div className="space-y-4">
              {activeForm.items && activeForm.items.length > 0 ? (
                <ol className="divide-y divide-[#DED8CF] rounded-sm border border-[#DED8CF]">
                  {activeForm.items.map((item, idx) => {
                    const q = item.questionItem?.question;
                    const kind = q?.choiceQuestion
                      ? 'Multiple choice'
                      : q?.textQuestion?.paragraph
                        ? 'Paragraph'
                        : q?.textQuestion
                          ? 'Short answer'
                          : 'Section item';

                    return (
                      <li
                        key={item.itemId ?? `${idx}-${item.title}`}
                        className="flex items-start justify-between gap-3 px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-medium text-[#202C32]">
                            <span className="mr-2 text-xs tabular-nums text-[#9B4D30]">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            {item.title || 'Untitled item'}
                            {q?.required && (
                              <span className="ml-1.5 text-xs font-normal text-[#9B4D30]">
                                (required)
                              </span>
                            )}
                          </p>
                          {item.description && (
                            <p className="mt-0.5 text-xs text-[#52616B]">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-[#52616B]">{kind}</span>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-4 text-sm text-[#52616B]">
                  This Google Form currently has no questions.
                </p>
              )}

              {/* Add question form (requires confirmation dialog before mutating) */}
              <form
                onSubmit={requestAddQuestion}
                className="space-y-3 rounded-sm border border-[#DED8CF] bg-[#F7F4EE] p-4"
              >
                <p className="text-xs font-medium text-[#202C32]">
                  Add a question to this Google Form
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="new-form-question" className="sr-only">
                    New question label
                  </label>
                  <input
                    id="new-form-question"
                    type="text"
                    value={newQuestionTitle}
                    onChange={(event) => setNewQuestionTitle(event.target.value)}
                    placeholder="e.g., Link to client brand assets or footage"
                    className="min-h-[40px] flex-1 rounded-sm border border-[#DED8CF] bg-[#FFFFFF] px-3 py-2 text-sm text-[#202C32] placeholder:text-[#7A8790] focus:border-[#9B4D30] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newQuestionTitle.trim()}
                    className="inline-flex min-h-[40px] items-center justify-center gap-1.5 whitespace-nowrap rounded-sm bg-[#9B4D30] px-4 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#833F26] disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Add question</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs text-[#52616B]">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newQuestionParagraph}
                      onChange={(event) => setNewQuestionParagraph(event.target.checked)}
                      className="h-4 w-4 accent-[#9B4D30]"
                    />
                    <span>Long paragraph response</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newQuestionRequired}
                      onChange={(event) => setNewQuestionRequired(event.target.checked)}
                      className="h-4 w-4 accent-[#9B4D30]"
                    />
                    <span>Required field</span>
                  </label>
                </div>
              </form>
            </div>
          )}

          {/* Responses panel */}
          {detailTab === 'responses' && (
            <div className="space-y-3">
              {responses.length === 0 ? (
                <p className="rounded-sm border border-[#DED8CF] bg-[#F7F4EE] px-4 py-5 text-sm text-[#52616B]">
                  No responses have been submitted to this Google Form yet.
                </p>
              ) : (
                <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
                  {responses.map((record, index) => {
                    const answerEntries = Object.values(record.answers ?? {});
                    return (
                      <li
                        key={record.responseId}
                        className="rounded-sm border border-[#DED8CF] bg-[#F7F4EE] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DED8CF] pb-2.5 text-xs text-[#52616B]">
                          <span className="font-medium text-[#202C32]">
                            Response {responses.length - index}
                            {record.respondentEmail ? ` · ${record.respondentEmail}` : ''}
                          </span>
                          <span className="tabular-nums">
                            {formatDateTime(record.lastSubmittedTime || record.createTime)}
                          </span>
                        </div>

                        {answerEntries.length === 0 ? (
                          <p className="mt-2.5 text-xs text-[#52616B]">
                            No text answers recorded on this submission.
                          </p>
                        ) : (
                          <dl className="mt-3 space-y-2 text-xs">
                            {answerEntries.map((answer) => {
                              const label =
                                questionTitleById.get(answer.questionId) ??
                                'Question';
                              const values =
                                answer.textAnswers?.answers
                                  ?.map((item) => item.value)
                                  .filter(Boolean)
                                  .join(', ') || '—';

                              return (
                                <div key={answer.questionId}>
                                  <dt className="font-medium text-[#202C32]">
                                    {label}
                                  </dt>
                                  <dd className="mt-0.5 leading-relaxed text-[#52616B]">
                                    {values}
                                  </dd>
                                </div>
                              );
                            })}
                          </dl>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mandatory explicit user confirmation modal for mutating Google Workspace calls */}
      {pendingMutation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="workspace-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C171D]/75 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isMutating) {
              setPendingMutation(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-md border border-[#DED8CF] bg-[#FFFFFF] p-6">
            <p className="text-xs font-medium text-[#9B4D30]">
              Confirm Google Forms update
            </p>
            <h3
              id="workspace-confirm-title"
              className="mt-1.5 font-display text-xl font-semibold text-[#202C32]"
            >
              {pendingMutation.type === 'create-form'
                ? 'Create a new Google Form in your Drive?'
                : 'Add a question to this Google Form?'}
            </h3>

            {pendingMutation.type === 'create-form' ? (
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-[#52616B]">
                <p>
                  This will create{' '}
                  <span className="font-medium text-[#202C32]">
                    {pendingMutation.title}
                  </span>{' '}
                  in your connected Google Drive with six fields:
                </p>
                <p className="text-xs text-[#202C32]">
                  Name · Agency or business name · Email (required) · Client
                  industry · Package of interest · Short project brief
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[#52616B]">
                This will append the{' '}
                {pendingMutation.paragraph ? 'paragraph' : 'short-answer'}{' '}
                question{' '}
                <span className="font-medium text-[#202C32]">
                  “{pendingMutation.questionTitle}”
                </span>{' '}
                {pendingMutation.required ? '(required) ' : ''}
                to{' '}
                <span className="font-medium text-[#202C32]">
                  {pendingMutation.formTitle}
                </span>
                .
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#DED8CF] pt-4">
              <button
                type="button"
                disabled={isMutating}
                onClick={() => setPendingMutation(null)}
                className="min-h-[42px] rounded-sm border border-[#DED8CF] px-4 py-2 text-sm font-medium text-[#202C32] transition-colors duration-150 hover:border-[#202C32] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isMutating}
                onClick={() => void executeConfirmedMutation()}
                className="min-h-[42px] rounded-sm bg-[#9B4D30] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#833F26] disabled:opacity-60"
              >
                {isMutating
                  ? 'Saving…'
                  : pendingMutation.type === 'create-form'
                    ? 'Confirm & create form'
                    : 'Confirm & add question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
