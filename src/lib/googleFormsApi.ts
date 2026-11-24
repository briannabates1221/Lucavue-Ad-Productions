export interface DriveFormSummary {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface GoogleFormQuestionOption {
  value: string;
}

export interface GoogleFormItem {
  itemId?: string;
  title?: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required?: boolean;
      textQuestion?: {
        paragraph?: boolean;
      };
      choiceQuestion?: {
        type?: string;
        options?: GoogleFormQuestionOption[];
      };
    };
  };
}

export interface GoogleFormDetails {
  formId: string;
  info?: {
    title?: string;
    documentTitle?: string;
    description?: string;
  };
  responderUri?: string;
  items?: GoogleFormItem[];
}

export interface GoogleFormAnswerValue {
  value?: string;
}

export interface GoogleFormAnswer {
  questionId: string;
  textAnswers?: {
    answers?: GoogleFormAnswerValue[];
  };
}

export interface GoogleFormResponseRecord {
  responseId: string;
  createTime?: string;
  lastSubmittedTime?: string;
  respondentEmail?: string;
  answers?: Record<string, GoogleFormAnswer>;
}

export class GoogleApiAuthError extends Error {
  constructor(message = 'Your Google session has expired. Please sign in again.') {
    super(message);
    this.name = 'GoogleApiAuthError';
  }
}

async function parseGoogleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    throw new GoogleApiAuthError();
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const apiMessage =
      payload?.error?.message ||
      `Google API request failed with status ${response.status}.`;
    throw new Error(apiMessage);
  }

  return payload as T;
}

export async function listGoogleForms(
  accessToken: string,
): Promise<DriveFormSummary[]> {
  const params = new URLSearchParams({
    q: "mimeType='application/vnd.google-apps.form' and trashed=false",
    fields: 'files(id,name,modifiedTime,webViewLink)',
    orderBy: 'modifiedTime desc',
    pageSize: '20',
  });

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await parseGoogleResponse<{files?: DriveFormSummary[]}>(response);
  return data.files ?? [];
}

export async function getGoogleForm(
  accessToken: string,
  formId: string,
): Promise<GoogleFormDetails> {
  const safeFormId = encodeURIComponent(formId.trim());
  const response = await fetch(
    `https://forms.googleapis.com/v1/forms/${safeFormId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return parseGoogleResponse<GoogleFormDetails>(response);
}

export async function getGoogleFormResponses(
  accessToken: string,
  formId: string,
): Promise<GoogleFormResponseRecord[]> {
  const safeFormId = encodeURIComponent(formId.trim());
  const response = await fetch(
    `https://forms.googleapis.com/v1/forms/${safeFormId}/responses`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await parseGoogleResponse<{
    responses?: GoogleFormResponseRecord[];
  }>(response);

  return data.responses ?? [];
}

export async function createLucavueInquiryForm(
  accessToken: string,
  title = 'Lucavue Ad Productions — Agency Inquiry Brief',
): Promise<GoogleFormDetails> {
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title,
        documentTitle: title,
      },
    }),
  });

  const created = await parseGoogleResponse<GoogleFormDetails>(createRes);
  const safeFormId = encodeURIComponent(created.formId.trim());

  const batchUpdateBody = {
    includeFormInResponse: true,
    requests: [
      {
        updateFormInfo: {
          info: {
            description:
              'White-label 30-second video ad inquiry for U.S. marketing agencies serving garage-door businesses. Start with one $95 starter ad before committing to a larger package.',
          },
          updateMask: 'description',
        },
      },
      {
        createItem: {
          item: {
            title: 'Name',
            questionItem: {
              question: {
                required: false,
                textQuestion: {paragraph: false},
              },
            },
          },
          location: {index: 0},
        },
      },
      {
        createItem: {
          item: {
            title: 'Agency or business name',
            questionItem: {
              question: {
                required: false,
                textQuestion: {paragraph: false},
              },
            },
          },
          location: {index: 1},
        },
      },
      {
        createItem: {
          item: {
            title: 'Email',
            description: 'Required so we can respond in writing.',
            questionItem: {
              question: {
                required: true,
                textQuestion: {paragraph: false},
              },
            },
          },
          location: {index: 2},
        },
      },
      {
        createItem: {
          item: {
            title: 'Client industry',
            description: 'Starting with garage-door service businesses.',
            questionItem: {
              question: {
                required: false,
                textQuestion: {paragraph: false},
              },
            },
          },
          location: {index: 3},
        },
      },
      {
        createItem: {
          item: {
            title: 'Package of interest',
            questionItem: {
              question: {
                required: false,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    {value: 'Starter Ad — $95 (1 ad)'},
                    {value: 'Four-Ad Pack — $340 (4 ads)'},
                    {value: 'Monthly Production — $750/month (10 ads/month)'},
                    {value: 'Not sure yet — discuss scope'},
                  ],
                },
              },
            },
          },
          location: {index: 4},
        },
      },
      {
        createItem: {
          item: {
            title: 'Short project brief',
            description:
              'Share your client’s offer, approved claims, available footage or photos, and rough timing.',
            questionItem: {
              question: {
                required: false,
                textQuestion: {paragraph: true},
              },
            },
          },
          location: {index: 5},
        },
      },
    ],
  };

  const updateRes = await fetch(
    `https://forms.googleapis.com/v1/forms/${safeFormId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchUpdateBody),
    },
  );

  const updated = await parseGoogleResponse<{form?: GoogleFormDetails}>(updateRes);
  return updated.form ?? created;
}

export async function appendFormQuestion(
  accessToken: string,
  formId: string,
  options: {
    title: string;
    paragraph: boolean;
    required: boolean;
    insertIndex: number;
  },
): Promise<GoogleFormDetails> {
  const safeFormId = encodeURIComponent(formId.trim());

  const response = await fetch(
    `https://forms.googleapis.com/v1/forms/${safeFormId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includeFormInResponse: true,
        requests: [
          {
            createItem: {
              item: {
                title: options.title.trim(),
                questionItem: {
                  question: {
                    required: options.required,
                    textQuestion: {
                      paragraph: options.paragraph,
                    },
                  },
                },
              },
              location: {
                index: Math.max(0, options.insertIndex),
              },
            },
          },
        ],
      }),
    },
  );

  const data = await parseGoogleResponse<{form?: GoogleFormDetails}>(response);
  if (data.form) {
    return data.form;
  }

  return getGoogleForm(accessToken, formId);
}

export function buildEmbeddedFormUrl(responderUri: string): string {
  try {
    const parsed = new URL(responderUri);
    parsed.searchParams.set('embedded', 'true');
    return parsed.toString();
  } catch {
    return responderUri;
  }
}
