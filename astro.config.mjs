// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import partytown from '@astrojs/partytown';

import yeskunallumami from '@yeskunall/astro-umami';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    yeskunallumami({
      id: '7aa7460b-bb4d-4a2f-ae97-6e18ff4f4ca3',
    }),
  ],
  output: 'server',
  adapter: vercel(),
});