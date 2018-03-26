module.exports = function() {
  return {
    files: ['assets/*', 'src/**/*.ts', '!src/**/*spec.ts'],
    tests: ['src/**/*spec.ts'],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest'
  };
};
