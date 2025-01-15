import { resolve } from 'path';

export default {
  // Vuetify module for Nuxt
  buildModules: [
    '@nuxtjs/vuetify',
  ],

  // Define global CSS
  css: [
    '~/assets/css/main.css', // Add your global CSS file here
  ],

  // Plugins
  plugins: [],

  // Vuetify module configuration
  vuetify: {
    customVariables: ['~/assets/variables.scss'], // Add custom SASS variables
    treeShake: true, // Enables tree-shaking
    defaultAssets: {
      font: {
        family: 'Inter',
      },
      icons: {
        iconfont: 'mdi', // Make sure 'mdi' is set as the icon font
      }
    },
  },

  // Aliases for importing files
  alias: {
    '@': resolve(__dirname, './'), // For src alias
  },

  // Additional Webpack configurations
  build: {
    extend(config, { isDev, isClient }) {
      // Modify Webpack config if needed
      config.resolve.alias['@'] = resolve(__dirname, './');
    },
  },

  // Add Google Fonts using @nuxtjs/google-fonts
  googleFonts: {
    families: {
      Inter: [100, 300, 400, 500, 700, 900], // Specify font weights
    },
  },

  // Nuxt server configuration
  server: {
    port: 3000, // Change server port
  },

  // Set environment variables
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
};
