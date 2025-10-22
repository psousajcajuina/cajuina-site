import express from 'express';
import cookieParser from 'cookie-parser';
import ServerlessHttp from 'serverless-http';
import { createLocalDatabase, createDatabase, TinaNodeBackend, LocalBackendAuthProvider, resolve } from '@tinacms/datalayer';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import AzureADProvider from 'next-auth/providers/azure-ad';
import cors from 'cors';
import { z } from 'zod';
import 'tinacms/dist/client';
import { GitHubProvider } from 'tinacms-gitprovider-github';

// api/tina.ts
var IS_DEV_MODE = process.env.NODE_ENV !== "production";
var devEnvSchema = z.object({
  BACKEND_GITHUB_BRANCH: z.string().default("cms/push"),
  BACKEND_GITHUB_REPO: z.string().default("cajuina-site"),
  BACKEND_GITHUB_OWNER: z.string().default("psousajcajuina"),
  BACKEND_GITHUB_TOKEN: z.string().default("fnciasocbiuwqbvjdsbviusebvnjdsvbdhj"),
  BACKEND_NEXTAUTH_SECRET: z.string().default("nfuiwabfuwqonbfwqjbno"),
  BACKEND_AUTH_MS_CLIENT_ID: z.string().default("fmwquionfcouewin"),
  BACKEND_AUTH_MS_CLIENT_SECRET: z.string().default("dmwqoijnfjqwkn"),
  BACKEND_AUTH_MS_TENANT_ID: z.string().default("mkfaqnfcjkanjl"),
  BACKEND_UPSTASH_REDIS_URL: z.string().default("http://localhost:8079"),
  BACKEND_UPSTASH_REDIS_TOKEN: z.string().default("example_token"),
  BACKEND_PORT: z.coerce.number().default(4001),
  BACKEND_CORS_ORIGINS: z.string().optional().default("http://localhost:4321"),
  BACKEND_DEBUG: z.coerce.boolean().optional().default(true),
  // ============================================
  // FRONTEND - Site Info
  // ============================================
  FRONTEND_SITE_URL: z.string().default("https://cajuinasaogeraldo.com.br"),
  FRONTEND_SITE_TITLE: z.string().default("S\xE3o Geraldo"),
  FRONTEND_SITE_DESCRIPTION: z.string().default(
    "Somos uma marca caririense que oferece \xE0 sociedade refrigerantes com alto padr\xE3o de qualidade. Esse \xE9 nosso principal objetivo e o que nos faz ser uma das maiores ind\xFAstrias de bebidas do Cear\xE1"
  ),
  FRONTEND_TINA_GRAPHQL_URL: z.string().default("http://localhost:4001/graphql"),
  FRONTEND_TINA_API_URL: z.string().default("http://localhost:4001"),
  FRONTEND_TINA_IS_LOCAL: z.coerce.boolean().default(true)
});
var prodEnvSchema = z.object({
  BACKEND_GITHUB_BRANCH: z.string({
    message: "BACKEND_GITHUB_BRANCH env var is required in production"
  }),
  BACKEND_GITHUB_REPO: z.string({
    message: "BACKEND_GITHUB_REPO env var is required in production"
  }),
  BACKEND_GITHUB_OWNER: z.string({
    message: "BACKEND_GITHUB_OWNER env var is required in production"
  }),
  BACKEND_GITHUB_TOKEN: z.string({
    message: "BACKEND_GITHUB_TOKEN env var is required in production"
  }),
  BACKEND_NEXTAUTH_SECRET: z.string({
    message: "BACKEND_NEXTAUTH_SECRET env var is required in production"
  }),
  BACKEND_AUTH_MS_CLIENT_ID: z.string({
    message: "BACKEND_AUTH_MS_CLIENT_ID env var is required in production"
  }),
  BACKEND_AUTH_MS_CLIENT_SECRET: z.string({
    message: "BACKEND_AUTH_MS_CLIENT_SECRET env var is required in production"
  }),
  BACKEND_AUTH_MS_TENANT_ID: z.string({
    message: "BACKEND_AUTH_MS_TENANT_ID env var is required in production"
  }),
  BACKEND_UPSTASH_REDIS_URL: z.string({
    message: "BACKEND_UPSTASH_REDIS_URL env var is required in production"
  }),
  BACKEND_UPSTASH_REDIS_TOKEN: z.string({
    message: "BACKEND_UPSTASH_REDIS_TOKEN env var is required in production"
  }),
  BACKEND_PORT: z.coerce.number().default(4001),
  BACKEND_CORS_ORIGINS: z.string().optional(),
  BACKEND_DEBUG: z.coerce.boolean().default(false),
  // ============================================
  // FRONTEND - Site Info
  // ============================================
  FRONTEND_SITE_URL: z.string({
    message: "FRONTEND_SITE_URL env var is required in production"
  }),
  FRONTEND_SITE_TITLE: z.string({
    message: "FRONTEND_SITE_TITLE env var is required in production"
  }),
  FRONTEND_SITE_DESCRIPTION: z.string({
    message: "FRONTEND_SITE_DESCRIPTION env var is required in production"
  }),
  FRONTEND_TINA_GRAPHQL_URL: z.string({
    message: "FRONTEND_TINA_GRAPHQL_URL env var is required in production"
  }),
  FRONTEND_TINA_API_URL: z.string({
    message: "FRONTEND_TINA_API_URL env var is required in production"
  }),
  FRONTEND_TINA_IS_LOCAL: z.coerce.boolean().default(false)
});
var env = IS_DEV_MODE ? devEnvSchema.parse(process.env) : prodEnvSchema.parse(process.env);

// consts.ts
env.FRONTEND_SITE_TITLE;
env.FRONTEND_SITE_DESCRIPTION;
env.FRONTEND_SITE_URL;
var IS_LOCAL = env.FRONTEND_TINA_IS_LOCAL;
var BRANCH = env.BACKEND_GITHUB_BRANCH;
process.env.NODE_ENV !== "production";
function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
var UserPartsFragmentDoc = gql`
    fragment UserParts on User {
  __typename
  users {
    __typename
    username
    name
    email
    password {
      value
      passwordChangeRequired
    }
  }
}
    `;
var BlogPartsFragmentDoc = gql`
    fragment BlogParts on Blog {
  __typename
  title
  description
  pubDate
  updatedDate
  heroImage
  body
}
    `;
var PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  seoTitle
  body
}
    `;
var ConfigPartsFragmentDoc = gql`
    fragment ConfigParts on Config {
  __typename
  seo {
    __typename
    title
    description
    siteOwner
  }
  nav {
    __typename
    title
    link
  }
  contactLinks {
    __typename
    title
    link
    icon
  }
}
    `;
var ProductsPartsFragmentDoc = gql`
    fragment ProductsParts on Products {
  __typename
  name
  slug
  image
  description
}
    `;
var UserDocument = gql`
    query user($relativePath: String!) {
  user(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;
var UserConnectionDocument = gql`
    query userConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: UserFilter) {
  userConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...UserParts
      }
    }
  }
}
    ${UserPartsFragmentDoc}`;
var BlogDocument = gql`
    query blog($relativePath: String!) {
  blog(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BlogParts
  }
}
    ${BlogPartsFragmentDoc}`;
var BlogConnectionDocument = gql`
    query blogConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BlogFilter) {
  blogConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BlogParts
      }
    }
  }
}
    ${BlogPartsFragmentDoc}`;
var PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
var PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
var ConfigDocument = gql`
    query config($relativePath: String!) {
  config(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ConfigParts
  }
}
    ${ConfigPartsFragmentDoc}`;
var ConfigConnectionDocument = gql`
    query configConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ConfigFilter) {
  configConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ConfigParts
      }
    }
  }
}
    ${ConfigPartsFragmentDoc}`;
var ProductsDocument = gql`
    query products($relativePath: String!) {
  products(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ProductsParts
  }
}
    ${ProductsPartsFragmentDoc}`;
var ProductsConnectionDocument = gql`
    query productsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ProductsFilter) {
  productsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ProductsParts
      }
    }
  }
}
    ${ProductsPartsFragmentDoc}`;
function getSdk(requester) {
  return {
    user(variables, options) {
      return requester(UserDocument, variables, options);
    },
    userConnection(variables, options) {
      return requester(UserConnectionDocument, variables, options);
    },
    blog(variables, options) {
      return requester(BlogDocument, variables, options);
    },
    blogConnection(variables, options) {
      return requester(BlogConnectionDocument, variables, options);
    },
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    },
    config(variables, options) {
      return requester(ConfigDocument, variables, options);
    },
    configConnection(variables, options) {
      return requester(ConfigConnectionDocument, variables, options);
    },
    products(variables, options) {
      return requester(ProductsDocument, variables, options);
    },
    productsConnection(variables, options) {
      return requester(ProductsConnectionDocument, variables, options);
    }
  };
}
var generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
var queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
var databaseClient = IS_LOCAL ? (
  // If we are running locally, use a local database that stores data in memory and writes to the local filesystem on save
  createLocalDatabase()
) : (
  // If we are not running locally, use a database that stores data in redis and Saves data to github
  createDatabase({
    gitProvider: new GitHubProvider({
      repo: process.env.BACKEND_GITHUB_REPO,
      owner: process.env.BACKEND_GITHUB_OWNER,
      token: process.env.BACKEND_GITHUB_TOKEN,
      branch: BRANCH
    }),
    databaseAdapter: {
      redis: {
        url: process.env.BACKEND_UPSTASH_REDIS_URL,
        token: process.env.BACKEND_UPSTASH_REDIS_TOKEN
      },
      debug: process.env.BACKEND_DEBUG,
      namespace: BRANCH
    }
  })
);
var database_default = databaseClient;

// tina/__generated__/databaseClient.ts
async function databaseRequest({ query, variables, user }) {
  const result = await resolve({
    config: {
      useRelativeMedia: true
    },
    database: database_default,
    query,
    variables,
    verbose: true,
    ctxUser: user
  });
  return result;
}
async function authenticate({ username, password }) {
  return databaseRequest({
    query: `query auth($username:String!, $password:String!) {
              authenticate(sub:$username, password:$password) {
               id:username name email _password: password { passwordChangeRequired }
              }
            }`,
    variables: { username, password }
  });
}
async function authorize(user) {
  return databaseRequest({
    query: `query authz { authorize { id:username name email _password: password { passwordChangeRequired }} }`,
    variables: {},
    user
  });
}
function createDatabaseClient({
  queries: queries2
}) {
  const request = async ({ query, variables, user }) => {
    const data = await databaseRequest({ query, variables, user });
    return { data: data.data, query, variables, errors: data.errors || null };
  };
  const q = queries2({
    request
  });
  return { queries: q, request, authenticate, authorize };
}
var databaseClient2 = createDatabaseClient({ queries });
var databaseClient_default = databaseClient2;

// api/tina.ts
var app = express();
var allowedOrigins = IS_LOCAL ? ["http://localhost:4321", "http://localhost:3000", "http://localhost:4200"] : [process.env.FRONTEND_SITE_URL, ...process.env.BACKEND_CORS_ORIGINS?.split(",") || []];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueou origem: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-branch"]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV
  });
});
var tinaBackend = TinaNodeBackend({
  authProvider: IS_LOCAL ? LocalBackendAuthProvider() : AuthJsBackendAuthProvider({
    authOptions: TinaAuthJSOptions({
      databaseClient: databaseClient_default,
      secret: process.env.BACKEND_NEXTAUTH_SECRET,
      debug: process.env.NODE_ENV !== "production",
      providers: [
        AzureADProvider({
          clientId: process.env.BACKEND_AUTH_MS_CLIENT_ID,
          clientSecret: process.env.BACKEND_AUTH_MS_CLIENT_SECRET,
          tenantId: process.env.BACKEND_AUTH_MS_TENANT_ID
        })
      ]
    })
  }),
  databaseClient: databaseClient_default
});
app.post("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});
app.get("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: IS_LOCAL ? err.message : "Ocorreu um erro no servidor"
  });
});
ServerlessHttp(app);
var tina_default = app;

// api/server.ts
var PORT = process.env.BACKEND_PORT || 4001;
tina_default.listen(PORT, () => {
  console.log(`\u{1F999} TinaCMS Backend rodando em ${process.env.FRONTEND_TINA_API_URL}`);
  console.log(`   GraphQL: ${process.env.FRONTEND_TINA_GRAPHQL_URL}`);
  console.log(`   Health: ${process.env.FRONTEND_TINA_API_URL}/health`);
});
