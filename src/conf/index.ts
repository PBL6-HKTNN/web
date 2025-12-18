const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const apiServiceUrlsKey = import.meta.env.VITE_SERVICES_URLS_KEY;
const stripePk = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const storageApiUrl = import.meta.env.VITE_STORAGE_API;
const reviewApiUrl = import.meta.env.VITE_REVIEW_API;
const automationApiUrl = import.meta.env.VITE_AUTOMATION_API;
const separatedServiceFlag = Number.parseInt(
  import.meta.env.VITE_SEPARATED_SERVICE ?? "0"
);
const ggRedirectUri = import.meta.env.VITE_GG_REDIRECT_URI;

export {
  clientId,
  apiUrl,
  apiServiceUrlsKey,
  stripePk,
  separatedServiceFlag,
  storageApiUrl,
  reviewApiUrl,
  automationApiUrl,
  ggRedirectUri,
};
