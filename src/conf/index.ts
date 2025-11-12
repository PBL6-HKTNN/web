const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const apiServiceUrlsKey = import.meta.env.VITE_SERVICES_URLS_KEY;
const separatedServiceFlag = Number.parseInt(
  import.meta.env.VITE_SEPARATED_SERVICE ?? "0"
);

export { clientId, apiUrl, apiServiceUrlsKey, separatedServiceFlag };
