// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import node from '@astrojs/node';

import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: false
      }),
      BETTER_AUTH_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: false
      })
    }
  },
  integrations: [tailwind({
    applyBaseStyles: false,
  }), react()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});