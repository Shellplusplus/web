import { defineConfig } from "astro/config";

const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  site: `https://${repoOwner || "cat-5054"}.github.io`,
  base: isGitHubPagesBuild && repoName ? `/${repoName}` : "/",
});
