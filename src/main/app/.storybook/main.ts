export default {
  stories: ['../src/**/*.stories.[tj]s?(x)'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  features: {
    storyStoreV7: false,
  },
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
  ],
  core: {
    builder: '@storybook/builder-vite'
  },
};
