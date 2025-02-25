export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
  ],
  hub: {
    cache: true,
  },
  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },

  // https://devtools.nuxt.com
  devtools: {
    enabled: true,
  },
  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
  
  nitro: {
    storage: process.env.NODE_ENV === 'development' 
      ? {
          data: {
            driver: 'memory'
          }
        }
      : {
          data: {
            driver: 'cloudflare-kv-binding'
          }
        }
  },
})