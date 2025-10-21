import { env } from "@env";

const SITE_TITLE = env.SITE_TITLE;
const SITE_DESCRIPTION = env.SITE_DESCRIPTION;
const SITE_URL = env.SITE_URL;
const IS_LOCAL = env.TINA_PUBLIC_IS_LOCAL;
const BRANCH = env.GITHUB_BRANCH;
const IS_DEV_MODE = process.env.NODE_ENV !== "production";

export { IS_LOCAL, BRANCH, SITE_TITLE, SITE_DESCRIPTION, IS_DEV_MODE };
