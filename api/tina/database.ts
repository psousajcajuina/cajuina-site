import { createDatabase, createLocalDatabase } from '@tinacms/datalayer'
import { GitHubProvider } from 'tinacms-gitprovider-github'
import { MongodbLevel } from 'mongodb-level'
import { env } from '../../env'
import { IS_LOCAL } from '../../consts'

const databaseClient = IS_LOCAL
  ? // If we are running locally, use a local database that stores data in memory and writes to the locac filesystem on save
    createLocalDatabase()
  : // If we are not running locally, use a database that stores data in redis and Saves data to github
    createDatabase({
      gitProvider: new GitHubProvider({
        repo: env.GITHUB_REPO ,
        owner: env.GITHUB_OWNER,
        token: env.GITHUB_PERSONAL_ACCESS_TOKEN,
        branch: env.GITHUB_BRANCH,
      }),
     databaseAdapter: new MongodbLevel<string, Record<string, any>>({
        collectionName: `tinacms-${env.GITHUB_BRANCH}`,
        dbName: 'tinacms',
        mongoUri: env.MONGODB_URI as string,
      }),
    })

export default databaseClient;