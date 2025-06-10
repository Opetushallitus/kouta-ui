export default {
  stories: ['../src/**/*.stories.[tj]s?(x)'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  features: {},
  addons: ['@storybook/addon-essentials', '@storybook/addon-links'],
  core: {
    builder: '@storybook/builder-vite',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
