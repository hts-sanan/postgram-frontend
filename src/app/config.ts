export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  useMocks: import.meta.env.VITE_USE_MOCKS !== 'false',
} as const;
