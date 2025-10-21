import { env } from "@env";

// Manage this flag in your CI/CD pipeline and make sure it is set to false in production
const IS_LOCAL = env.TINA_PUBLIC_IS_LOCAL;
const BRANCH = env.GITHUB_BRANCH;
const SITE_TITLE = "Astro Blog";
const SITE_DESCRIPTION = "Welcome to my website!";

export { IS_LOCAL, BRANCH, SITE_TITLE, SITE_DESCRIPTION };
