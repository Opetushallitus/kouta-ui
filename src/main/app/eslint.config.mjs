import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import lodashEsPlugin from 'eslint-plugin-lodash-es';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default defineConfig([
  globalIgnores([
    'service-worker.js',
    'test-server.js',
    'src/types/kouta-backend.api.ts',
    '**/*.typegen.ts',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
      lodashEsPlugin.configs.recommended,
      eslintConfigPrettier,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-empty': 'off',
      '@eslint-react/rules-of-hooks': 'error',
      '@eslint-react/exhaustive-deps': 'warn',
      // @eslint-react/eslint-plugin's recommended-typescript config bundles a much larger
      // "React Compiler readiness" rule set beyond rules-of-hooks/exhaustive-deps (purity,
      // set-state-in-*, static-components, use-memo/use-state, unsupported-syntax,
      // error-boundaries). Disabled here to keep the same reduced scope the project has always
      // used; adopting the full set is a separate, code-level task.
      '@eslint-react/purity': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/set-state-in-render': 'off',
      '@eslint-react/static-components': 'off',
      '@eslint-react/unsupported-syntax': 'off',
      '@eslint-react/use-memo': 'off',
      '@eslint-react/use-state': 'off',
      '@eslint-react/error-boundaries': 'off',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
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
                'Tuo Field ja FieldArray osoitteesta #/src/components/formFields/Field.',
            },
            {
              group: ['lodash', 'lodash/**', 'lodash-fp', 'lodash-fp/**'],
              message: 'Tuo lodash-es:stä, ei lodashista tai lodash-fp:stä.',
            },
          ],
        },
      ],
    },
  },
  {
    // Nämä tiedostot saavat tuoda lomakekirjastoa suoraan: formFields/Field.tsx on
    // wrapper itse, ReactFinalForm/index.tsx mountaa <Form>-juuren ja hooks/form.ts
    // lukee lomaketilaa. hooks/useSaveForm.ts ei kuulu listalle: se lukee lomaketilan
    // hooks/form.ts:n kautta eikä tunne kirjastoa.
    files: [
      'src/components/formFields/Field.tsx',
      'src/components/ReactFinalForm/index.tsx',
      'src/hooks/form.ts',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['playwright/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './playwright/tsconfig.json',
      },
    },
    rules: {
      'playwright/expect-expect': 'off',
      '@typescript-eslint/no-floating-promises': ['error'],
    },
  },
]);
