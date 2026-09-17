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
    'plugin:react-hooks/recommended',
    'plugin:lodash-es/recommended-legacy',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-empty': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/jsx-uses-react': ['error'],
    'import/no-duplicates': ['error'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowTernary: true,
        allowShortCircuit: true,
      },
    ],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'generic',
      },
    ],
    'prettier/prettier': 'warn',
    'import/no-anonymous-default-export': 'off',
    'import/order': [
      'error',
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
    'no-negated-condition': ['error'],
    'no-implicit-coercion': ['error'],
    'no-var': ['error'],
    // Kenttäkomponentit tuodaan aina #/src/components/formFields/Field -wrapperin kautta,
    // ei suoraan lomakekirjastosta. Wrapper ilmoittaa kentät kenttärekisterille ja toistaa
    // redux-formin semantiikan, joten suora tuonti jättäisi kentän niiden ulkopuolelle
    // ilman että mikään kaatuisi tai näkyisi testeissä.
    //
    // Rajoitus koskee koko moduulia, ei yksittäisiä vientejä: nimilista pettäisi hiljaa
    // heti kun joku ottaisi käyttöön nimen jota listalla ei ole.
    //
    // Sallitut poikkeukset ovat overrides-listassa.
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              'react-final-form',
              'react-final-form/**',
              'react-final-form-arrays',
              'react-final-form-arrays/**',
            ],
            message:
              'Import Field ja FieldArray from #/src/components/formFields/Field',
          },
          {
            group: ['lodash', 'lodash/**', 'lodash-fp', 'lodash-fp/**'],
            message: 'Use lodash-es instead',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      // Nämä tiedostot saavat tuoda lomakekirjastoa suoraan: formFields/Field.tsx on
      // wrapper itse, ReactFinalForm/index.tsx mountaa <Form>-juuren ja hooks/form.ts
      // lukee lomaketilaa. hooks/useSaveForm.ts ei kuulu listalle: se lukee lomaketilan
      // hooks/form.ts:n kautta eikä tunne kirjastoa.
      files: [
        './src/components/formFields/Field.tsx',
        './src/components/ReactFinalForm/index.tsx',
        './src/hooks/form.ts',
      ],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
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
