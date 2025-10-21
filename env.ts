import { z } from "zod";

const envSchema = z.object({
  GITHUB_BRANCH: z.string().default("cms/push"),
  GITHUB_REPO: z.string().default("cajuina-site"),
  GITHUB_OWNER: z.string().default("psousajcajuina"),
  GITHUB_PERSONAL_ACCESS_TOKEN: z.string().default("fnciasocbiuwqbvjdsbviusebvnjdsvbdhj"),
  MONGODB_URI: z.url().default("mongodb://root:TinaCMS%21@localhost:27017/tinacms"),
  TINA_PUBLIC_IS_LOCAL: z.coerce.boolean().default(true),
  NEXTAUTH_SECRET: z.string().default("nfuiwabfuwqonbfwqjbno"),
  SITE_URL: z.string().default("https://cajuinasaogeraldo.com.br"),
  DEBUG: z.coerce.boolean().optional().default(false)
});

type envType = z.infer<typeof envSchema>;

const env = envSchema.parse(process.env);

export { env, envSchema, type envType };
