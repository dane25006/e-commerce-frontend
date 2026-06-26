const config = {
  apiUrl:     import.meta.env.VITE_API_URL     || 'http://127.0.0.1:8000/api',
  apiBaseUrl: (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(
    /\/api\/?$/,
    '',
  ),
  appName:    import.meta.env.VITE_APP_NAME    || 'ECommerce',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDev:      import.meta.env.DEV,
  isProd:     import.meta.env.PROD,
} as const

export default config
