import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github";
import { RedisLevel } from "upstash-redis-level";
import { env } from "../env";
import { BRANCH, IS_LOCAL } from "../consts";

const databaseClient = IS_LOCAL
  ? // If we are running locally, use a local database that stores data in memory and writes to the local filesystem on save
    createLocalDatabase()
  : // If we are not running locally, use a database that stores data in redis and Saves data to github
    createDatabase({
      gitProvider: new GitHubProvider({
        repo: env.BACKEND_GITHUB_REPO,
        owner: env.BACKEND_GITHUB_OWNER,
        token: env.BACKEND_GITHUB_TOKEN,
        branch: BRANCH,
      }),
      databaseAdapter: new RedisLevel<string, Record<string, any>>({
        redis: {
          url: env.BACKEND_UPSTASH_REDIS_URL,
          token: env.BACKEND_UPSTASH_REDIS_TOKEN,
        },
        debug: env.BACKEND_DEBUG,
        namespace: BRANCH,
      }),
    });

export default databaseClient;
