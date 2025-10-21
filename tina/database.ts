import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github";
import { RedisLevel } from "upstash-redis-level";
import { env } from "../env";
import { BRANCH, IS_LOCAL } from "../consts";

const databaseClient = IS_LOCAL
  ? // If we are running locally, use a local database that stores data in memory and writes to the locac filesystem on save
    createLocalDatabase()
  : // If we are not running locally, use a database that stores data in redis and Saves data to github
    createDatabase({
      gitProvider: new GitHubProvider({
        repo: env.GITHUB_REPO,
        owner: env.GITHUB_OWNER,
        token: env.GITHUB_PERSONAL_ACCESS_TOKEN,
        branch: BRANCH,
      }),
      databaseAdapter: new RedisLevel<string, Record<string, any>>({
        redis: {
          url:
            (process.env.KV_REST_API_URL as string) || "http://localhost:8079",
          token: (process.env.KV_REST_API_TOKEN as string) || "example_token",
        },
        debug: env.DEBUG,
        namespace: BRANCH,
      }),
    });

    export default databaseClient