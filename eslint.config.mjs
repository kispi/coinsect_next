import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import unusedImports from 'eslint-plugin-unused-imports'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      prettier: prettierPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      'prettier/prettier': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  eslintConfigPrettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.agents/**']),
])
