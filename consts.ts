import { env } from "@env";

// Manage this flag in your CI/CD pipeline and make sure it is set to false in production
const isLocal = env.TINA_PUBLIC_IS_LOCAL;
const branch = env.GITHUB_BRANCH;

export { isLocal, branch };
