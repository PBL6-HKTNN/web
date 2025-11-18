/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@conf': path.resolve(__dirname, './src/conf'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Exclude e2e tests when running vitest
    exclude: [
      '**/e2e/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
    reporters: ['default', 'html'], 
    outputFile: './reports/vitest-report.html',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './reports/coverage',
      all: true,                                   
      include: [
        'src/components/auth/forms/**/*.{ts,tsx}',
        'src/components/course/course-card/*.{ts,tsx}',
        'src/components/course/course-edit/general-info/*.{ts,tsx}',
        'src/components/course/course-list/*.{ts,tsx}',
        'src/components/course/course-table/*.{ts,tsx}',
        'src/components/course/lesson-item/*.{ts,tsx}',
        'src/components/course/module-accordion/*.{ts,tsx}',
      ],     
      exclude: ['**/*.d.ts', '**/*.test.{ts,tsx}'],
    },
  },
})
