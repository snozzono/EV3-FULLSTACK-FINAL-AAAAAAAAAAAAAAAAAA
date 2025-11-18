import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.{js,jsx}'],
    pool: 'forks',
    maxWorkers: 1,
    minWorkers: 1,
    isolate: true,
    setupFiles: ['src/test/setup.js'],
  },
})