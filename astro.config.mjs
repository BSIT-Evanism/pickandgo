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
    partytown(),
    yeskunallumami({
      id: '8ce19401-77af-41af-ae50-793b53f32be5',
    }),
  ],
  output: 'server',
  adapter: vercel(),
});