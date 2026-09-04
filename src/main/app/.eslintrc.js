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
    'lodash/import-scope': 'off',
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-chain': 'off',
    'lodash/prefer-constant': 'off',
    'lodash/prefer-noop': 'off',
    'lodash/prefer-includes': 'off',
    'lodash/path-style': 'off',
    'no-negated-condition': ['error'],
    'no-implicit-coercion': ['error'],
    'no-var': ['error'],
    // Kenttäkomponentit tuodaan aina #/src/components/formFields/Field -kääreen kautta,
    // ei suoraan redux-formista. Kääre on se paikka, johon kenttien rekisteröinnin seuranta
    // lisätään ennen kirjastonvaihtoa, joten suora tuonti jättäisi kentän seurannan
    // ulkopuolelle ilman että mikään kaatuisi tai näkyisi testeissä.
    //
    // Rajoitus koskee koko moduulia, ei yksittäisiä vientejä: nimilista pettäisi hiljaa
    // heti kun joku ottaisi käyttöön nimen jota listalla ei ole. Juuri niin kävi Fields-
    // komponentille (monikko), joka jäi kahdesti huomaamatta migraatiota suunniteltaessa.
    //
    // Sallitut poikkeukset ovat overrides-listassa tiedoston lopussa.
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['redux-form', 'redux-form/**'],
            message:
              'Tuo Field, FieldArray ja Fields osoitteesta #/src/components/formFields/Field.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      // Nämä tiedostot saavat tuoda redux-formia suoraan.
      //
      // formFields/Field.tsx on kääre itse eli ainoa paikka, joka saa tuoda
      // kenttäkomponentit. Neljä muuta käyttävät redux-formin muita rajapintoja (reducer,
      // reduxForm, action creatorit); ne eivät poistu kääreen myötä vaan vasta silloin, kun
      // lomakekirjasto oikeasti vaihdetaan.
      files: [
        './src/components/formFields/Field.tsx',
        './src/components/ReduxForm/index.tsx',
        './src/hooks/form.ts',
        './src/hooks/useSaveForm.ts',
        './src/state/store.ts',
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
