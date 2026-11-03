import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * GitHub Pages serves the site from https://USERNAME.github.io/REPO_NAME/
 * so asset paths must start with /REPO_NAME/.
 *
 * On GitHub Actions, GITHUB_REPOSITORY is "owner/repo" — we use that automatically.
 * Locally (`npm run dev`) we use "/" so everything works on localhost.
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
})
