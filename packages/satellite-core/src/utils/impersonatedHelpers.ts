export const impersonatedHelpers = {
  impersonatedAddress:
    typeof window !== 'undefined' ? (window.localStorage.getItem('satellite-connect:impersonatedAddress') ?? '') : '',
  setImpersonated: (address: string) =>
    typeof window !== 'undefined'
      ? window.localStorage.setItem('satellite-connect:impersonatedAddress', address)
      : undefined,
  getImpersonated: () =>
    typeof window !== 'undefined' ? window.localStorage.getItem('satellite-connect:impersonatedAddress') : undefined,
};
