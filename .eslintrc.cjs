module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['tests/**/*'],
      plugins: ['jest'],
      env: {
        'jest/globals': true
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
