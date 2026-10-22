import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const FIREBASE_VARIABLES = [
  'FIREBASE_API_KEY',
  'FIREBASE_APP_ID',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
];

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };

  return {
    plugins: [react()],
    publicDir: 'public',
    build: {
      outDir: 'build',
    },
    define: Object.fromEntries(
      FIREBASE_VARIABLES.map((name) => [`process.env.${name}`, JSON.stringify(env[name])])
    ),
  };
});
