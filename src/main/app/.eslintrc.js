module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:lodash/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'lodash', 'import'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-empty': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/jsx-uses-react': ['warn'],
    'import/no-duplicates': ['warn'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          object: false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/array-type': [
      'warn',
      {
        default: 'generic',
      },
    ],
    'prettier/prettier': 'warn',
    'import/no-anonymous-default-export': 'off',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '#/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'lodash/import-scope': 'off',
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-chain': 'off',
    'lodash/prefer-constant': 'off',
    'lodash/prefer-noop': 'off',
    'lodash/prefer-includes': 'off',
    'lodash/path-style': 'off',
    'no-negated-condition': ['warn'],
    'no-implicit-coercion': ['warn'],
    'no-var': ['warn'],
  },
  overrides: [
    {
      files: './playwright/*.ts',
      extends: 'plugin:playwright/recommended',
      parserOptions: {
        tsconfigRootDir: __dirname,
        parser: '@typescript-eslint/parser',
        project: './playwright/tsconfig.json',
      },
      rules: {
        'playwright/expect-expect': 'off',
        '@typescript-eslint/no-floating-promises': ['error'],
      },
    },
  ],
};
