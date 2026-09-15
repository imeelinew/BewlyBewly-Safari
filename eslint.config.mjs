import antfu from '@antfu/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu(
  {
    ignores: [
      'Safari/**',
      'build/**',
      'extension-safari/**',
    ],
    formatters: {
      css: 'prettier',
      prettierOptions: {
        printWidth: 120,
        singleQuote: false,
      },
    },
    rules: {
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 5,
          },
          multiline: {
            max: 5,
          },
        },
      ],
      'no-alert': 'off',
      'style/quote-props': 'off',
    },
    eslint: {
      ignorePatterns: [
        'dist',
        'node_modules',
        'public',
        'extension',
        'extension-firefox',
        'extension-safari',
        'Safari',
        'build',
      ],
    },
  },
  {
    name: 'bewly/generated-ignores',
    ignores: [
      'Safari/**',
      'build/**',
      'extension-safari/**',
    ],
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'import/order': 'off',
      'sort-imports': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
)
